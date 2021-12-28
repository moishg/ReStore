 
import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";


interface HeaderProps{
    darkMode:boolean;
    handleThemeChange:()=>void;
}

const midLinks=[
    {title:'catalog',path:'/catalog'},
    {title:'about',path:'/about'},
    {title:'contact',path:'/contact'}
]

const rightLinks=[
    {title:'login',path:'/login'},
    {title:'register',path:'/register'},         
]

const navStyles={
    color:'inherit',
    typography:'h6',
    '&:hover':{
            color:'grey.500'                                         
    },
    '&.active':{
        color:'GrayText.secondary'
    }
} 

export default function Header({darkMode,handleThemeChange}:HeaderProps ){
    return(
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}} >
                <Box display='flex'  alignItems='center'>
                    <Typography exact variant='h6' component={NavLink} to='/' 
                        sx={navStyles} >
                        RE-STORE                    
                    </Typography>
                    <Switch  checked={darkMode} onChange={handleThemeChange} />
                </Box>
                                
                <List sx={{display:'flex'}}>
                    {midLinks.map(({title,path})=>(                                                  
                        <ListItem 
                            component={NavLink} 
                            to={path} 
                            key={path} 
                            sx={navStyles} 
                        >
                        {title.toUpperCase()}            
                        </ListItem>                        
                    ))}
                </List>
                <Box display='flex'  alignItems='center'>
                <IconButton  component={Link} to='/basket' size='large' sx={{color:'inherit'}}>
                    <Badge badgeContent={4} color='secondary'>
                        <ShoppingCart></ShoppingCart>
                    </Badge>
                </IconButton>
                <List sx={{display:'flex'}}>
                    {rightLinks.map(({title,path})=>(                                                  
                        <ListItem 
                            component={NavLink} 
                            to={path} 
                            key={path} 
                            sx={navStyles} 
                        >
                        {title.toUpperCase()}            
                        </ListItem>                        
                    ))}
                </List>
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}