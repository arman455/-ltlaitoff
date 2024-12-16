import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import './ModalWindow.css'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
}

const ModalWindow: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	const { t } = useTranslation()

	if (!isOpen) {
		return null
	}

	return (
		<div
			className="modal-overlay"
			onClick={onClose}
		>
			<div
				className="modal-content"
				onClick={e => e.stopPropagation()}
			>
				<button
					className="modal-close"
					onClick={onClose}
				>
					{t('modal.close')}
				</button>
				{children}
			</div>
		</div>
	)
}

export default ModalWindow
