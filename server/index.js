const express = require("express");
const multer = require("multer");
const Excel = require("exceljs")
const cors = require("cors");



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use((cors()));

const classTime = {
    "2": "9:00-9:30",
    "3": "9:30-10:00",
    "4": "10:00-10:30",
    "5": "10:30-11:00",
    "6": "",
    "7": "11:00-11:30",
    "8": "11:30-12:00",
    "9": "12:00-12:30",
    "10": "12:30-13:00",
    "11": "13:00-13:30",
    "12": "13:30-14:00",
    "13": "",
    "14": "14:00-14:30",
    "15": "14:30-15:00",
    "16": "15:00-15:30",
    "17": "15:30-16:00",
    "18": "16:00-16:30",
    "19": "16:30-17:00",
    "20": "17:00-17:30",
    "21": "17:30-18:00",
    "22": "18:00-18:30",
    "23": "18:30-19:00",
    "24": "19:00-19:30",
    "25": "19:30-20:00",
}


const weekDay = {"0":"SUN","1":"MON","2":"TUE","3":"WED","4":"THU","5":"FRI","6":"SAT"};


const storage = multer.memoryStorage() //used the multer moudle to manupulate the incomng file 
const upload = multer({ storage: storage })

app.post("/aip",upload.single("file"),(req,res) =>{
    
	
    var startTime = req.body.startTime;
    
   var endTime = req.body.endTime;
   var time = `${startTime}-${endTime}`;


   const startTimeSplit = startTime.split(":")
   const endTimeSplit = endTime.split(":")
	
	let newTimeSlots = [];
	newTimeSlots.push(startTime);

	const timeSlotDifference = endTimeSplit[0]-startTimeSplit[0];
	const actualTimeSlot = timeSlotDifference*2;
	
	for(let i = 0; i<actualTimeSlot; i++){
		tempTime = newTimeSlots[i];
		let newTimeSlot;
		let tempTimeSplit = tempTime.split(":");
		if(tempTimeSplit[1] == "00"){
			newTimeSlot = `${tempTimeSplit[0]}:30`
			newTimeSlots.push(newTimeSlot);
		}
		else if(tempTimeSplit[1] == "30"){
			let hourSplitValue = tempTime.split(":");
			let hourValue = hourSplitValue[0];
			let newHour = +hourValue+1; //converted string to number type for adddition
			newTimeSlot = `${newHour}:00`
			newTimeSlots.push(newTimeSlot);
		}
	}

	
	
	var date = req.body.date;
    //this will get the date and it returns day number which will then fetch the day from the week day array
    var inputDate = new Date(date);
    var dayNumber = inputDate.getDay();
    var day = weekDay[dayNumber];
	var errorMessage = [];
	let freeSlot= [];
	let timeSlots = [];
	if(day == "SUN" || !day){
		res.status(400).json("Selected Day must be a working day")
	}
	else if(!req.file ||req.file.mimetype !="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ){
		res.status(400).json("File Not Uploaded. File must be in .xlsx format")
	}
	else{
	

	
  	const workBook = new Excel.Workbook();
		workBook.xlsx.load(req.file.buffer).then(() =>{
			
			//This is a for each loop which will iterate over every sheet in the workbook.
			workBook.eachSheet(function(worksheet){
				let factName = worksheet.getCell(1,1).value
				var slotObject = {"name":"","status":[]}; // this object will reinitilize with each loop iteration 
				for(let i=0; i<newTimeSlots.length; i++){
					let newTimeSlot = newTimeSlots[i]
					
					for(let row = 7; row<= 12; row++) //This loop will control the row itretaion
					{	
						let days = worksheet.getCell(row,1)
						//rsconsole.log(`WORKING DAY ${worksheet.getCell(row,1)}`);
						for(let col = 2; col <=25; col++) //This loop will control the coloumn iteration 
						{
							let slotStartTimeSplit = classTime[col].split("-");
							let slotStartTime = slotStartTimeSplit[0];
							
							if(slotStartTime == newTimeSlot  && days == day){
								//If the cell is having a value that means the facukty is not free else they are free and the meeting can be scedulecd for that time slot.
									if(!worksheet.getCell(row,col).value){
										//freeSlot.push(`${factName.substring(29)} slot time ${classTime[col]}`);
										slotObject.name = `${factName.substring(29)}`
										//slotObject.slotFree.push(`${classTime[col]}`)
										timeSlots.push(`${classTime[col]}`)
										slotObject.status.push("YES")
										
										
									}
									else{
										timeSlots.push( `${classTime[col]}`)
										
										slotObject.status.push("NO")
										
									}
									

								}
								
						}
					}
				}
				freeSlot.push(slotObject);
				
				
			})
			res.status(200).json({freeSlot,newTimeSlots})
 		})
	}
		
	
})




app.listen(3001,() =>{
    console.log("server started on port 3001");
})