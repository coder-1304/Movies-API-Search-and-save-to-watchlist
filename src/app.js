const express = require('express');
const app = express();
const path = require('path');
require('./connection/connection');
const User = require('./schema/schema');
app.use(express.urlencoded({ extended: false }));

//For Password hash encryption
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');  // User Authorisation
const cookieParser = require('cookie-parser');  // To get the cookies on user's browser
app.use(cookieParser());

//for public folder
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

app.get('/home', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../webpages/main.html'));
})
app.get('/logout', auth, async (req, res) => {
    try {
        //logout from all devices:
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();  //saving the cleared cookie
        console.log('logged out successfully');
        res.redirect('http://localhost:8000');
        res.end();
    } catch (error) {
        res.status(500).send('error ' + error);
    }
});

// app.get('/seeInfo',auth,async (req,res)=>{
//     // req.user.watchlist=['success','full']
//     req.user.watchlist=[];
//     await req.user.save();
//     res.send(req.user.watchlist);
// })

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../webpages/register.html'));
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../webpages/login.html'));
})

app.get('/saveToWatchlist/:movieName',auth, async (req, res) => {

    const movie = req.params.movieName;
    req.user.watchlist.push(movie);
    await req.user.save();
    res.send();
})

app.get('/deleteFromWatchlist/:movie',auth, async (req, res) => {
    const movie = req.params.movie;

    let data = req.user.watchlist;

    for (let i = 0; i < data.length; i++) {
        if (data[i] == movie) {
            data.splice(i, 1);
        }
    }
    await req.user.save();

    // console.log(data);
    // const updated = await User.findByIdAndUpdate({ _id }, {
    //     $set: {
    //         watchlist: data
    //     }
    // }, { new: true });
    // // res.send(data);
    res.send();
})



app.post('/registerMe', async (req, res) => {
    if (req.body.password != req.body.Cpassword) {
        res.send('passwords are not matching');
        return;
    }

    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            watchlist: []
        });
        const token = await user.generateAuthToken();
        const savedUser = await user.save();
        console.log(savedUser);
        // alert('You are registered, please login now');
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 50000000),   //in milliseconds 
            httpOnly: true,
            // secure: true
        }).redirect('http://localhost:8000/home');
        // res.end();

    } catch (error) {
        console.log(error);
    }
});
app.post('/loginMe', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email })

        const isMatch = await bcrypt.compare(password, user.password);
        const token = await user.generateAuthToken();

        if (isMatch) {
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 50000000),   //in milliseconds 
                httpOnly: true,
                // secure: true
            }).redirect('http://localhost:8000/home');
            res.end();
        } else {
            res.send('invalid login details');
        }

    } catch (error) {
        console.log(error);
        res.send('Invalid Login Details!!');
    }
});

app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, '../webpages/watchlist.html'));
})
app.get('/watchlistJSON',auth, async (req, res) => {
    // const result = await User.find({ email: 'shanneeahirwar@gmail.com' });
    // const data = result[0];
    res.send(req.user);
})



app.listen(8000, () => {
    console.log('Server running at port 8000');
})