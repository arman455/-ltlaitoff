import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import jsonData from '../../temp/filterData.json'
import ModalWindow from '../ModalWindow/ModalWindow'
import './Main.css'

interface IData {
	id: string
	name: string
	description?: string
	type: string
	options: {
		id: string
		name: string
		description: string
	}[]
	children?: React.ReactNode
}

export const Main = () => {
	const { t } = useTranslation()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isModalOpenFilter, setIsModalOpenFilter] = useState(false)
	const [data, setData] = useState<IData[]>([])
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({})
	const [savedFilters, setSavedFilters] = useState<Record<string, string[]>>({})

	const closeModal = () => setIsModalOpen(false)
	const closeModalFilter = () => setIsModalOpenFilter(false)

	const openModal = () => setIsModalOpen(true)
	const openModalFilter = () => setIsModalOpenFilter(true)

	useEffect(() => {
		if (jsonData && jsonData.filterItems) {
			setData(jsonData.filterItems)

			const initialFilters: Record<string, string[]> = {}
			jsonData.filterItems.forEach((item: IData) => {
				initialFilters[item.id] = []
			})
			setSavedFilters(initialFilters)
		}
	}, [])

	const handleCheckboxChange = (
		itemId: string,
		optionName: string,
		isChecked: boolean
	) => {
		setSelectedFilters(prev => {
			const newFilters = { ...prev }
			if (!newFilters[itemId]) {
				newFilters[itemId] = []
			}

			if (isChecked) {
				newFilters[itemId].push(optionName)
			} else {
				newFilters[itemId] = newFilters[itemId].filter(
					name => name !== optionName
				)
			}

			return newFilters
		})
	}

	const applyNewFilters = () => {
		setSavedFilters(selectedFilters)
		closeModal()
		closeModalFilter()
	}

	const discardChanges = () => {
		setSelectedFilters(savedFilters)
		closeModal()
	}

	return (
		<div className="mainDiv">
			<button
				onClick={openModalFilter}
				className="buttonModalWindow"
			>
				{t('modalWindow')}
			</button>

			<ModalWindow
				isOpen={isModalOpenFilter}
				onClose={closeModalFilter}
			>
				<div className="modalDivFilter">
					<h1 className="headerFont">{t('Filter')}</h1>

					<div className="checkDiv">
						{data.map(item => (
							<div
								key={item.id}
								className="infoDiv"
							>
								<hr className="customLine" />
								<h2 className="nameText">{item.name}</h2>

								<div className="optionDiv">
									{item.options.map(option => (
										<div
											key={option.id}
											className="checkboxOption"
										>
											<input
												type="checkbox"
												id={`checkbox-${option.id}`}
												name={option.name}
												value={option.name}
												checked={
													selectedFilters[item.id]?.includes(option.name) ||
													false
												}
												onChange={e =>
													handleCheckboxChange(
														item.id,
														option.name,
														e.target.checked
													)
												}
											/>

											<label
												htmlFor={`checkbox-${option.id}`}
												className="optionText"
											>
												{option.name}
											</label>
										</div>
									))}
								</div>
							</div>
						))}
						<hr className="customLine" />
					</div>

					<button
						className="applyButton"
						onClick={openModal}
					>
						{t('Apply')}
					</button>
				</div>
			</ModalWindow>

			<ModalWindow
				isOpen={isModalOpen}
				onClose={closeModal}
			>
				<div className="modalDiv">
					<h1 className="headerFont">{t('confirmApply')}</h1>
					<div className="buttonDiv">
						<button
							className="buttonModalWindow"
							onClick={discardChanges}
						>
							{t('useOldFilter')}
						</button>
						<button
							className="applyButton"
							onClick={applyNewFilters}
						>
							{t('applyNewFilter')}
						</button>
					</div>
				</div>
			</ModalWindow>

			<div className="dataDiv">
				<h4>{JSON.stringify(selectedFilters, null, 2)}</h4>
			</div>
		</div>
	)
}
