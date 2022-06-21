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
	Autocomplete,
	Link,
	ImageList,
	ImageListItem,
	Box,
	Card,
} from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import Dropzone from 'react-dropzone-uploader'
import * as Yup from 'yup'
import 'react-dropzone-uploader/dist/styles.css'
import './App.css'
import ResultsTable from './components/ResultsTable'

function App() {
	const [preview, setPreview] = useState('')
	const [isLoading, setLoading] = useState(false)
	const [response, setResponse] = useState('')

	const recommendation = [
		{ label: 'quần, áo, dây nịt, giày, áo khoác, nón, đồng hồ, nhẫn, vòng tay, dây chuyền' },
		{ label: 'ly, chén, chai nước, ấm trà, bàn, ghế' },
		{ label: 'màn hình, chuột máy tính, bàn phím, tai nghe' },
	]

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
			result_number: '',
			class_image_number: '',
		},
		validationSchema: Yup.object({
			names: Yup.string().min(1).required('Required'),
			lang: Yup.string().length(2).required('Required'),
			image: Yup.string().min(1).required('Required'),
			result_number: Yup.number().positive().required('Required'),
			class_image_number: Yup.number().positive().required('Required'),
		}),
		onSubmit: ({ names, lang, image, result_number, class_image_number }) => {
			setLoading(true)
			const url = 'http://118.69.218.59:7554/identify'
			const data = new FormData()
			data.append('names', names)
			data.append('lang', lang)
			data.append('image', image)
			data.append('result_number', result_number)
			data.append('class_image_number', class_image_number)
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
			<Container maxWidth='md'>
				<form
					className='dropzone'
					onSubmit={(e) => {
						e.preventDefault()
						formik.handleSubmit()
					}}
				>
					<Grid container spacing={2}>
						<Grid item sm={12}>
							<Typography variant='h3' gutterBottom component='div'>
								IMAGE SEARCH
							</Typography>
						</Grid>
						<Grid item sm={12}>
							<Autocomplete
								disablePortal
								options={recommendation}
								renderInput={(params) => (
									<TextField {...params} onInput={formik.handleChange} name='names' label='Names' />
								)}
								onInputChange={(event, newInputValue) => {
									formik.setFieldValue('names', newInputValue)
								}}
								value={formik.values.names}
							/>
							{formik.errors.names ? (
								<Typography
									pl={1.8}
									style={{
										color: 'red',
									}}
								>
									{formik.errors.names}
								</Typography>
							) : null}
						</Grid>
						<Grid item sm={4}>
							<FormControl fullWidth>
								<InputLabel>Language</InputLabel>
								<Select value={formik.values.lang} name='lang' onChange={formik.handleChange} label='Language'>
									<MenuItem value='vi'>Vietnam</MenuItem>
									<MenuItem value='en'>English</MenuItem>
								</Select>
							</FormControl>
							{formik.errors.lang ? (
								<Typography
									pl={1.8}
									style={{
										color: 'red',
									}}
								>
									{formik.errors.lang}
								</Typography>
							) : null}
						</Grid>
						<Grid item sm={4}>
							<TextField
								fullWidth
								label='Number of results'
								type='number'
								InputLabelProps={{
									shrink: true,
								}}
								name='result_number'
								onChange={formik.handleChange}
							/>
							{formik.errors.result_number && formik.values.result_number === '' ? (
								<Typography
									pl={1.8}
									style={{
										color: 'red',
									}}
								>
									{formik.errors.result_number}
								</Typography>
							) : null}
						</Grid>
						<Grid item sm={4}>
							<TextField
								fullWidth
								label='Number of images per result'
								type='number'
								InputLabelProps={{
									shrink: true,
								}}
								name='class_image_number'
								onChange={formik.handleChange}
							/>
							{formik.errors.class_image_number && formik.values.class_image_number === '' ? (
								<Typography
									pl={1.8}
									style={{
										color: 'red',
									}}
								>
									{formik.errors.class_image_number}
								</Typography>
							) : null}
						</Grid>
						<Grid item sm={12}>
							<Dropzone
								getUploadParams={getUploadParams}
								onChangeStatus={handleChangeStatus}
								multiple={false}
								accept='image/*'
							/>
							{formik.errors.image && formik.values.image === '' ? (
								<Typography
									pl={1.8}
									style={{
										color: 'red',
									}}
								>
									{formik.errors.image}
								</Typography>
							) : null}
						</Grid>
						<Grid item sm={6}>
							{preview && response !== '' ? (
								<Card>
									<img src={preview} alt='Preview' width='auto' height={400} />
								</Card>
							) : null}
						</Grid>
						<Grid item sm={6}>
							{response.url && (
								<Card>
									<ImageList
										sx={{ width: '100%', height: 400 }}
										cols={3}
										rowHeight={150}
										style={{
											backgroundColor: '#f0f0f0',
											boxShadow: 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px',
										}}
									>
										{response.url.map((item) => (
											<ImageListItem>
												<img
													src={`${item}?w=164&h=164&fit=crop&auto=format`}
													srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
													loading='lazy'
													alt=''
												/>
											</ImageListItem>
										))}
									</ImageList>
								</Card>
							)}
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
						<Grid item sm={12}>
							{response.names && <ResultsTable names={response.names} scores={response.scores} />}
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	)
}

export default App
