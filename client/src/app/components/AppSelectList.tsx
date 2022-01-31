import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
    items: string[];
}

export default function AppSelectList(props: Props) {
    const { fieldState, field } = useController({ ...props, defaultValue: '' });
    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel  >{props.label}</InputLabel>
            <Select
                value={field.value}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map((item, index) => (
                    <MenuItem value={10}>Ten</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}