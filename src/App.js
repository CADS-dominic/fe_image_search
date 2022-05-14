import {
	Button,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
	CircularProgress,
	Alert,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import './App.css'

function App() {
	const [names, setNames] = useState([])
	const [lang, setLang] = useState('')
	const [file, setFile] = useState('')
	const [preview, setPreview] = useState('')
	const [isLoading, setLoading] = useState(false)
	const [response, setResponse] = useState('')

	const handleLangChange = (e) => {
		setLang(e.target.value)
	}
	const handleNamesChange = (e) => {
		setNames(e.target.value.split(','))
	}
	const getUploadParams = ({ meta }) => {
		return { url: 'https://httpbin.org/post' }
	}
	const handleChangeStatus = ({ meta, file }, status) => {
		if (status === 'done' || status === 'removed') {
			setLoading(false)
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onloadend = () => {
				if (status === 'removed') {
					setFile('')
					setResponse('')
				} else {
					setFile(reader.result.replace(/^data:image\/[a-z]+;base64,/, ''))
					setPreview(reader.result)
				}
			}
		} else {
			setLoading(true)
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		const url = 'http://118.69.218.59:7554/identify'
		const data = new FormData()
		data.append('names', names)
		data.append('lang', lang)
		data.append('image', file)
		axios(url, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data,
		}).then((res) => {
			setLoading(false)
			setResponse(res.data)
			console.log(res)
		})
	}
	return (
		<div className='App'>
			<Container maxWidth='sm'>
				<form className='dropzone' onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item sm={12}>
							<Typography variant='h2' gutterBottom component='div'>
								IMAGE SEARCH
							</Typography>
						</Grid>
						<Grid item sm={12}>
							<TextField
								label='Names'
								variant='outlined'
								fullWidth
								placeholder='Jean,Skirt,Tshirt,...'
								helperText='Separate by comma, no spacebar'
								onInput={handleNamesChange}
							/>
						</Grid>
						<Grid item sm={12}>
							<FormControl fullWidth>
								<InputLabel>Language</InputLabel>
								<Select value={lang} onChange={handleLangChange} label='Language'>
									<MenuItem value='vi'>Vietnam</MenuItem>
									<MenuItem value='en'>English</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item sm={12}>
							<Dropzone
								getUploadParams={getUploadParams}
								onChangeStatus={handleChangeStatus}
								multiple={false}
								accept='image/*'
							/>
						</Grid>
						<Grid item sm={6}>
							{preview && response !== '' ? <img src={preview} alt='Preview' /> : null}
						</Grid>
						<Grid item sm={6}>
							{response.code === 2100 ? (
								<Alert severity='error'>Error!</Alert>
							) : response.code === 200 ? (
								response.names.map((name, index) => {
									return (
										<Typography key={name} variant='body2' gutterBottom>
											{name}: {response.scores[index]}
										</Typography>
									)
								})
							) : null}
						</Grid>
						<Grid item sm={12} textAlign='center'>
							{isLoading ? (
								<CircularProgress />
							) : (
								<Button variant='contained' fullWidth type='submit'>
									Submit
								</Button>
							)}
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	)
}

export default App
