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
		if (status === 'done') {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onloadend = () => {
				// setFile(reader.result.replace(/^data:image\/[a-z]+;base64,/, ''))
				setFile(reader.result)
			}
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const url = 'http://118.69.218.59:7554/identify'
		// const url = 'http://localhost:5000'
		const data = new FormData()
		data.append('names', names)
		data.append('lang', lang)
		data.append('image', file)
		console.log(names, lang, file)
		axios(url, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data,
		}).then((res) => console.log(res))
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
						<Grid item sm={12}>
							<Button variant='contained' fullWidth type='submit'>
								Submit
							</Button>
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	)
}

export default App
