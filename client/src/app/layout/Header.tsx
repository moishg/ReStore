import { AppBar, Switch, Toolbar, Typography } from "@mui/material";


interface HeaderProps{
    checked:string;
}

export default function Header({checked}:HeaderProps ){
    return(
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar>
                <Typography variant='h6'>
                    RE-STORE
                    <Switch  onChange={(e)=>{checked=e.target.value}} />
                </Typography>
            </Toolbar>
        </AppBar>
    )
}