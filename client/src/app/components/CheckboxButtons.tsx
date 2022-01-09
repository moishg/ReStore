import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;
}

export default function CheckBoxButtons({ items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);//passing array or empty
    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);//finding item index  in the array whhich is clicked(checked)
        let newChecked: string[] = [];

        if (currentIndex === - 1)//,adding the value of the checked item 
            newChecked = [...checkedItems, value];
        else
            newChecked = checkedItems.filter(item => item !== value);//

        setCheckedItems(newChecked);

        onChange(newChecked);//returning a list of items 
    }
    return (
        <FormGroup>
            {
                items.map(item => (
                    <FormControlLabel
                        control={<Checkbox
                            checked={checkedItems.indexOf(item) !== -1}
                            onClick={() => handleChecked(item)}
                        />}
                        label={item} key={item} />
                ))
            }
        </FormGroup>
    )
}