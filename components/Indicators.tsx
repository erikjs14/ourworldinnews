import { Tooltip } from 'antd';
import React from 'react';
import styles from '../styles/Indicators.module.scss';
import DragIndicator from '../assets/drag-indicator.svg';
import ZoomIndicator from '../assets/zoom-indicator.svg';
import PinchIndicator from '../assets/zoom-in.svg';
import PlusIndicator from '../assets/plus.svg';
import MinusIndicator from '../assets/minus.svg';

interface Props {
    onPlusClicked(): void;
    onMinusClicked(): void;
}
export default function Indicators( { onPlusClicked, onMinusClicked }: Props) {

    return (
        <>
            <div className={styles.indicators}>
                <Tooltip title='Drag the map' mouseEnterDelay={0.3} >
                    <DragIndicator />
                </Tooltip>
                <Tooltip title='Zoom using the mouse wheel' mouseEnterDelay={0.3} placement='topLeft'>
                    <ZoomIndicator className={styles.desktop} />
                </Tooltip>
                <Tooltip title='Pinch to zoom' mouseEnterDelay={0.3} placement='topLeft'>
                    <PinchIndicator className={styles.mobile} />
                </Tooltip>
            </div>

            <div className={styles.zoomBtns}>
                <PlusIndicator
                    onClick={onPlusClicked}
                />
                <MinusIndicator 
                    onClick={onMinusClicked}
                />
            </div>
        </>
    )
}