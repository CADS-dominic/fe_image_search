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
import { useFormik, setFieldValue } from 'formik'
import { useState } from 'react'
import Dropzone from 'react-dropzone-uploader'
import * as Yup from 'yup'
import 'react-dropzone-uploader/dist/styles.css'
import './App.css'

function App() {
	const [preview, setPreview] = useState('')
	const [isLoading, setLoading] = useState(false)
	const [response, setResponse] = useState('')

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
					setResponse('')
					setPreview('')
					formik.values.image = ''
				} else {
					setPreview(reader.result)
					formik.values.image = reader.result.replace(/^data:image\/[a-z]+;base64,/, '')
				}
			}
		} else {
			setLoading(true)
		}
	}
	const formik = useFormik({
		initialValues: {
			names: '',
			lang: '',
			image: '',
		},
		validationSchema: Yup.object({
			names: Yup.string().min(1).required(),
			lang: Yup.string().length(2).required(),
			image: Yup.string().min(1).required(),
		}),
		onSubmit: ({ names, lang, image }) => {
			setLoading(true)
			const url = 'http://118.69.218.59:7554/identify'
			const data = new FormData()
			data.append('names', names)
			data.append('lang', lang)
			data.append('image', image)
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
			})
		},
	})
	return (
		<div className='App'>
			<Container maxWidth='sm'>
				<form
					className='dropzone'
					onSubmit={(e) => {
						e.preventDefault()
						formik.handleSubmit()
					}}
				>
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
								onInput={formik.handleChange}
								value={formik.values.names}
								name='names'
							/>
							{formik.errors.names ? <Alert severity='error'>{formik.errors.names}</Alert> : null}
						</Grid>
						<Grid item sm={12}>
							<FormControl fullWidth>
								<InputLabel>Language</InputLabel>
								<Select value={formik.values.lang} name='lang' onChange={formik.handleChange} label='Language'>
									<MenuItem value='vi'>Vietnam</MenuItem>
									<MenuItem value='en'>English</MenuItem>
								</Select>
							</FormControl>
							{formik.errors.lang ? <Alert severity='error'>{formik.errors.lang}</Alert> : null}
						</Grid>
						<Grid item sm={12}>
							<Dropzone
								getUploadParams={getUploadParams}
								onChangeStatus={handleChangeStatus}
								multiple={false}
								accept='image/*'
							/>
							{formik.errors.image && formik.values.image === '' ? (
								<Alert severity='error'>{formik.errors.image}</Alert>
							) : null}
						</Grid>
						<Grid item sm={6}>
							{preview && response !== '' ? <img src={preview} alt='Preview' /> : null}
						</Grid>
						<Grid item sm={6}>
							{response.names
								? response.names.map((name, index) => {
										return (
											<Typography key={name} variant='body2' gutterBottom>
												- {name}: {response.scores[index]}
											</Typography>
										)
								  })
								: null}
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
