import styles from '../styles/LangPicker.module.scss';
import { getIff, toCss } from './../utils/util';

export const DONT_TRANSLATE_VAL = 'donttranslate';
interface LangPickerProps {
    langs: Array<{
        label: string;
        value: string;
    }>;
    value: string;
    onChange(newValue: string): void;
}
export default function LangPicker({ langs, value, onChange }: LangPickerProps) {
    return (
        <div className={styles.container}>

            {[{label: 'No Translation', value: DONT_TRANSLATE_VAL}].concat(langs).map(lang => (
                <span 
                    key={lang.value}
                    className={toCss(styles.item, getIff(lang.value === value, styles.selected))}
                    onClick={() => onChange(lang.value)}
                >
                    <i></i>
                    {lang.label}
                </span>
            ))}
        </div>
    );
}