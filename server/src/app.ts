import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/files';
import rootRoutes from './routes/roots';
import settingsRoutes from './routes/settings';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api/roots', rootRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
