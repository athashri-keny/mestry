 import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connect to database")
    return
  }
  try {
   const db =  await mongoose.connect(process.env.MONGODB_URL || '' )
   // extracting data 

 connection.isConnected = db.connections[0].readyState
 
 console.log("Db Connect Sucessfully")
  } catch (error) {
  console.log("Error occured while conntecting to database" , error)
     process.exit(1)
  }
}
export default dbConnect  