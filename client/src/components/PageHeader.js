import { Card, Paper, Typography, styled } from "@mui/material"
import ScheduleIcon from '@mui/icons-material/Schedule';





const Container = styled("div")({
    display:"flex",
    gap:10
    
})
const TextContainer = styled("div")({
    padding:2,
    
    
})

export function PageHeader(){
    return(
    <>
        <Paper variant="outlined" elevation={8} square sx={{height:50,padding:2,backgroundColor:"#fdfdff"}}>
            <Container>
                <Card variant="outlined" sx={{width:25, height:25, display:"flex", alignItems:"center",justifyContent:"center", padding:2}}><ScheduleIcon sx={{color:"#3c44b1"}}/></Card>
                    <TextContainer>
                        <Typography variant="h6" component="div" sx={{letterSpacing:4}}><b>AIP SCHEDULING</b></Typography> 
                        <Typography variant="subtitle2" component="div" sx={{letterSpacing:2}}>NIIT University</Typography> 
                    </TextContainer>
            </Container>
        </Paper>
    </>
    )

}