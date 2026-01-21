//start srver
import dotenv from 'dotenv';
dotenv.config();

import { connectdb } from './src/db/db.js';
import app from './src/app.js';

connectdb()
// .then(()=> {
//     app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);
//     });
// })
// .catch((err) => {
//     console.error("Error starting server:", err);
// });

export default app;