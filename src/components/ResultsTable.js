import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from '@mui/material'

export default function ResultsTable({ names, scores }) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }}>
				<TableHead>
					<TableRow>
						<TableCell>Object</TableCell>
						<TableCell>Score</TableCell>
						<TableCell>Link</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{names.map((name, index) => (
						<TableRow key={name}>
							<TableCell>{name}</TableCell>
							<TableCell>{scores[index]}</TableCell>
							<TableCell>
								<Link key={name} href={`https://shopee.vn/search?keyword=${name}`} target='_blank'>
									Shopee
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
