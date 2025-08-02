const express = require('express');
const session = require('express-session');
const app = express();
const Category = require('./models/Category');
const Menu = require('./models/Menu');
const sequelize = require('./db/Connection');
const cloudRoutes = require('./routes/UserRoutes');
const menuItems = require('./routes/MenuRoutes');
const contactus = require('./routes/ContactUsRoutes');
const addtocart = require('./routes/AddtoCartRoutes');
const category = require('./routes/CategoryRoutes');
const vendor = require('./routes/VendorRoutes');
const order = require('./routes/OrderRoutes');
const address = require('./routes/AddressRoutes');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret_key", 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/category', express.static(path.join(__dirname, 'category')));
app.use('/vendor',express.static(path.join(__dirname, 'vendor')));
app.use('/',address);
app.use('/', cloudRoutes);
app.use('/',addtocart);
app.use('/',menuItems);
app.use('/',contactus);
// app.use('/',addtocart);
app.use('/',category);
// app.use('/',history);
app.use('/',order);
app.use('/',vendor);

Category.hasMany(Menu, { foreignKey: 'category_id' });
Menu.belongsTo(Category, { foreignKey: 'category_id' });
module.exports = { Category, Menu };

sequelize.sync().then(() => {
    app.listen(7000, () => console.log(`Server is running on port 7000`));
});