import express from 'express';
import dotenv from 'dotenv';
import Staff from  './models/staff.js';
import User from './models/user.js';
import Category from './models/category.js'
import mongoose from 'mongoose';
import Complaint from './models/complaints.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5003;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Error on connecting mongo db...");
    });
    


//FOR GETTING STAFF LIST
app.get('/api/staff',(req,res)=>{
   Staff.find()
    .then((staff) => {
        const staffNames = staff.map((s) => s.name);

        res.json({
            success: true,
            staff: staffNames,
            staffDetails: staff
        });
    })
    .catch((err) => {
        res.json({
            success: false,
            message: "Fail in fetching staff..."
        });
    });
})



//FOR GETTING CATEGORIES LIST
app.get('/api/categories',(req,res)=>{
        Category.find()
        .then((category)=>{
                    const catNames=category.map((cat)=>cat.name);
            res.json({
                success:true,
                categories:catNames
            })
        })
        .catch((err)=>{
            res.json({
                success:false,
                message:"Fail to get categories..."
            })
        })
})

// FOR GETTING COMPLAINTS
app.get('/api/complaints', (req, res) => {

    const { studentEmail, assignedStaff } = req.query;

    let filter = {};

    if (studentEmail) {
        filter.studentEmail = studentEmail;
    }

    if (assignedStaff) {
        filter.assignedStaff = assignedStaff;
    }

    Complaint.find(filter)
        .then((complaints) => {
            res.json({
                success: true,
                complaints: complaints
            });
        })
        .catch((err) => {
            console.log("Error fetching complaints:", err);

            res.status(500).json({
                success: false,
                message: "Fail to fetch complaints..."
            });
        });
});


app.post('/api/login',(req,res)=>{
       const {name,email,password,role}=req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all login fields..."
            });
        }

        User.findOne({
            email:email.trim().toLowerCase(),
            password:password.trim(),
            role:role.trim().toLowerCase()
        }).then((user)=>{
            if(user){
                res.json({
                     success:true,
                     user:{
                        name:user.name,
                        email:user.email,
                        role:user.role
                     }
                })
            }
            else{
                res.status(401).json({
                    success:false,
                    message:"Email or pass is wrong..."
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({
                success:false,
                message:"Internal server error on login side..."
            })
        })
})

app.post('/api/submit-complaint', (req, res) => {

    const { title, category, roomNo, description, studentName, studentEmail } = req.body;

    Complaint.findOne().sort({id:-1})
        .then((lastComplaint) => {

            let nextId = 1001;

            if (lastComplaint && lastComplaint.id) {
                nextId = parseInt(lastComplaint.id.substring(1)) + 1;
            }

            const complaint = new Complaint({
                id: "C" + nextId,
                studentName: studentName,
                studentEmail: studentEmail,
                title: title,
                category: category,
                roomNo: roomNo,
                description: description,
                date: new Date().toLocaleDateString(),
                assignedStaff: "",
                status: "Pending",
                remark: ""
            });

            complaint.save()
                .then((savedComplaint) => {

                    res.json({
                        success: true,
                        complaint: savedComplaint
                    });

                })
                .catch((err) => {

                    console.log("Error saving complaint:", err);

                    res.status(500).json({
                        success: false,
                        message: "Fail to save complaint..."
                    });

                });

        })
        .catch((err) => {

            console.log("Error generating complaint ID:", err);

            res.status(500).json({
                success: false,
                message: "Fail to generate complaint ID..."
            });

        });
});

app.post('/api/update-complaint', (req, res) => {

    const {id,status,assignedStaff,remark}=req.body;

    Complaint.findOne({ id: id })
        .then((complaint) => {

            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint not found..."
                });
            }

            if (assignedStaff !== undefined) {
                complaint.assignedStaff = assignedStaff;
                if (complaint.status === 'Pending' && assignedStaff) {
                    complaint.status = 'Assigned';
                }
            }

            if (status !== undefined) {
                complaint.status = status;
            }

            if (remark !== undefined) {
                complaint.remark = remark;
            }

            complaint.save()
                .then((updatedComplaint) => {
                    res.json({
                        success: true,
                        complaint: updatedComplaint
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Fail to update complaint..."
                    });
                });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Fail to find complaint..."
            });
        });
});

app.post('/api/signup',(req,res)=>{
    const {name,email,password,confirmPassword}=req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields..."
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match..."
        });
    }

    User.findOne({ email: email.trim().toLowerCase() })
    .then((existingUser) => {

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered..."
            });
        }
        const user = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: "student"
        });

        user.save()
        .then((savedUser) => {
            res.json({
                success: true,
                user: {
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Fail to create user..."
            });
        });

    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Fail to check email..."
        });
    });
});

//FOR ADDING NEW STAFF (Admin only)
app.post('/api/add-staff', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all staff fields (name, email, password)..."
        });
    }

    User.findOne({ email: email.trim().toLowerCase() })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Staff with this email already exists..."
                });
            }

            const staffMember = new Staff({
                name: name.trim()
            });

            staffMember.save()
                .then(() => {
                    const staffUser = new User({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password: password.trim(),
                        role: "staff"
                    });

                    staffUser.save()
                        .then(() => {
                            res.json({
                                success: true,
                                message: "Staff member added successfully!",
                                staff: {
                                    name: name.trim(),
                                    email: email.trim().toLowerCase()
                                }
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                message: "Fail to create staff login account..."
                            });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Fail to save staff member..."
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Fail to check existing staff..."
            });
        });
});

//FOR REMOVING STAFF (Admin only)
app.post('/api/remove-staff', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Please provide staff name to remove..."
        });
    }

    Staff.deleteOne({ name: name.trim() })
        .then(() => {
            User.deleteMany({ name: name.trim(), role: "staff" })
                .then(() => {
                    res.json({
                        success: true,
                        message: `Staff member ${name.trim()} removed successfully!`
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Fail to remove staff login account..."
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Fail to remove staff..."
            });
        });
});

app.listen(PORT,()=>{
    console.log(`Backend is running on ${PORT}...`);
});


