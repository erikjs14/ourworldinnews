import { Card, Radio } from 'antd';
import { getIff, toCss } from './../utils/util';

export const DONT_TRANSLATE_VAL = 'donttranslate';
interface LangPickerProps {
    className?: string;
    langs: Array<{
        label: string;
        value: string;
    }>;
    value: string;
    onChange(newValue: string): void;
}
export default function LangPicker({ className, langs, value, onChange }: LangPickerProps) {

    const radioStyle = {
        display: 'block',
        height: '3rem',
        lineHeight: '3rem',
    };

    return (
        <Card
            className={className}
            size='small'
            title='Pick a Language'
        >
            <Radio.Group 
                onChange={e => onChange(e.target.value)}
                value={value}
            >
                {[{label: 'No Translation', value: DONT_TRANSLATE_VAL}].concat(langs).map(lang => (
                    <Radio 
                        key={lang.value}
                        value={lang.value} 
                        style={radioStyle}
                    >
                        {lang.label}
                    </Radio>
                ))}
            </Radio.Group>
        </Card>


        // <div className={styles.container}>

        //     {[{label: 'No Translation', value: DONT_TRANSLATE_VAL}].concat(langs).map(lang => (
        //         <span 
        //             key={lang.value}
        //             // className={toCss(styles.item, getIff(lang.value === value, styles.selected))}
        //             onClick={() => onChange(lang.value)}
        //         >
        //             {/* <i></i> */}
        //             {lang.label}
        //         </span>
        //     ))}
        // </div>
    );
}