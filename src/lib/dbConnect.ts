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
 
   // You store it in connection.isConnected to avoid reconnecting every time dbConnect() runs.
 connection.isConnected = db.connections[0].readyState //  readyState tells you if you're connected (1), disconnected (0), etc.
 
 console.log("Db Connect Sucessfully")
  } catch (error) {
  console.log("Error occured while conntecting to database" , error)
     process.exit(1)
  }
}
export default dbConnect  