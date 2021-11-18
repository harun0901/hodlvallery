import React, { useEffect, useState } from "react";


export interface DropdownContainerProps {
	children: React.ReactNode;
	label?: string;
	customLabel?: React.ReactNode;
	autosize?: boolean;
	selectedValueLabel?: string;
}


const DropdownContainer: React.FC<DropdownContainerProps> = ({
	label,
	customLabel,
	children,
	autosize,
	selectedValueLabel,
	...rest
}): JSX.Element => {
	const [customWidth, setCustomWidth] = useState<number>(0);

	useEffect(() => {
		if (autosize && selectedValueLabel) {
			setCustomWidth(selectedValueLabel.length * 8 + 7);
		}
	}, [selectedValueLabel, autosize]);

	return (
		<div>
			{customLabel && customLabel}
			{label && (
				<div>
					<p>
						{label}
					</p>
				</div>
			)}
			<div className={'flex h-42px'}>
				{children}
			</div>
		</div>
	);
};

export default DropdownContainer;
