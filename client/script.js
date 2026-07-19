// =============================
// GK EVENT MANAGEMENT
// script.js
// ===========================
let generatedOTP = "";
let selectedHall = "";
let selectedPlaces = [];
let currentBookingType = "";
let currentBookingDetails = "";
let currentAmount = 0;
let previousPage = "";
let selectedServices = [];
let bookingTotal = 0;
const bookingCharges = 75;

function saveBooking(type, details) {

    let bookings =
        JSON.parse(
            localStorage.getItem("myBookings")
        ) || [];

    bookings.push({
        type: type,
        details: details,
        bookingTime: new Date().toLocaleString(),
        status: "Confirmed"
    });

    localStorage.setItem(
        "myBookings",
        JSON.stringify(bookings)
    );
}

// Loader
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 1500);
});

// -----------------------------
// Page Navigation
// -----------------------------
const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const otpPage = document.getElementById("otpPage");
const dashboardPage = document.getElementById("dashboardPage");
const homePage = document.getElementById("Home");

document.getElementById("showSignup")?.addEventListener("click", () => {
    loginPage.classList.add("d-none");
    signupPage.classList.remove("d-none");
});

document.getElementById("showLogin")?.addEventListener("click", () => {
    signupPage.classList.add("d-none");
    loginPage.classList.remove("d-none");
    homePage.classList.add("d-none");
});

// -----------------------------
// Signup
// -----------------------------
document.getElementById("signupForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let mobile = document.getElementById("signupMobile").value.trim();
    let password = document.getElementById("signupPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (
        fullName === "" ||
        email === "" ||
        mobile === "" ||
        password === "" ||
        confirmPassword === ""
    ) {
        Swal.fire("Error", "Please fill all fields", "error");
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match", "error");
        return;
    }

    try {
        
        console.log({
    fullName,
    email,
    mobile,
    password
});
   const response = await fetch("http://localhost:5000/api/auth/sendOTP", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        fullName,
        email,
        mobile,
        password
    })
});
    const data = await response.json();
    console.log("Status:", response.status);
console.log("Response:", data);

    if (response.ok) {

        signupPage.classList.add("d-none");
        otpPage.classList.remove("d-none");

       document.getElementById("otpDisplay").innerText =
        "Your OTP is: " + data.otp;

    } else {

        Swal.fire(
            "Error",
            data.message,
            "error"
        );

    }
alert("Your OTP is: " + data.otp);
} catch (error) {

    Swal.fire(
        "Error",
        error.message || "Server Error",
        "error"
    );

}
});
// -----------------------------
// Generate OTP
// -----------------------------
document.getElementById("resendOtp").addEventListener("click", async () => {

    const mobile = document.getElementById("signupMobile").value.trim();

    await fetch("http://localhost:5000/api/auth/sendOTP", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ mobile })

    });

    Swal.fire(
        "Success",
        "New OTP Sent",
        "success"
    );

});

// -----------------------------
// Verify OTP
// -----------------------------
document.getElementById("verifyOtp")?.addEventListener("click", async () => {

    let otpInputs = document.querySelectorAll(".otp-input");

    let enteredOTP = "";

    otpInputs.forEach(input => {
        enteredOTP += input.value;
    });

    const mobile = document.getElementById("signupMobile").value.trim();

    try {

        const response = await fetch("http://localhost:5000/api/auth/verifyOTP", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mobile,
                otp: enteredOTP
            })

        });

        const data = await response.json();

        if (response.ok) {

            Swal.fire(
                "Success",
                "OTP Verified Successfully",
                "success"
            );

            otpPage.classList.add("d-none");
            dashboardPage.classList.remove("d-none");

        } else {

            Swal.fire(
                "Error",
                data.message,
                "error"
            );

        }

    } catch (error) {

        Swal.fire(
            "Error",
            "Server Error",
            "error"
        );

    }

});

// -----------------------------
// Login
// -----------------------------

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {

    e.preventDefault();

    const loginUser = document.getElementById("loginUser").value.trim();
    const loginPassword = document.getElementById("loginPassword").value;

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: loginUser,
                password: loginPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return Swal.fire("Error", data.message, "error");
        }

        localStorage.setItem("token", data.token);

await Swal.fire({
    icon: "success",
    title: "Login Successful",
    timer: 1500,
    showConfirmButton: false
});
console.log("Login Success");

loginPage.classList.add("d-none");
dashboardPage.classList.remove("d-none");

console.log("Dashboard opened");
    } catch (error) {

        console.error("Login Error:", error);

        Swal.fire(
            "Error",
            "Unable to connect to server",
            "error"
        );

    }

});
// -----------------------------
// Logout
// -----------------------------
document.getElementById("logoutBtn")?.addEventListener("click", () => {

    dashboardPage.classList.add("d-none");
    loginPage.classList.remove("d-none");

    Swal.fire(
        "Logged Out",
        "Successfully Logged Out",
        "success"
    );
});

// -----------------------------
// Dark Mode
// -----------------------------
document.getElementById("darkModeBtn")?.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (
        document.body.classList.contains("dark-mode")
    ) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// -----------------------------
// Hall Data
// -----------------------------
const hallData = {
    "Andhra Pradesh": {
        "Prakasam": ["Ongole", "Kandukur", "Markapur", "Prakasam"],
        "Guntur": ["Mangalagiri", "Tenali", "Amaravathi", "Guntur"],
        "Nellore": ["Kavali", "Atmakur", "Sullurpeta", "Nellore"] 

    },

    "Telangana": {
        "Adilabad": ["Adilabad", "Mancherial", "Nirmal"],
        "Bhadradri Kothagudem": ["Kothagudem", "Bhadrachalam"], 
        "Hanumakonda": ["Warangal", "Hanamkonda", "Kazipet"],
        "Hyderabad": ["Charminar", "Secunderabad"],
        "Jagtial": ["Jagtial", "Metpally"],
        "jangaon": ["Jangaon", "Gundala"],
        "jayashankar Bhupalpally": ["Bhupalpally", "Chityal"],
        "Jogulamba Gadwal": ["Gadwal", "Alampur"],
        "Kamareddy": ["Kamareddy", "Yellareddy"],   
        "kumuram Bheem Asifabad": ["Asifabad", "Kumaram Bheem"],
        "Mahabubabad": ["Mahabubabad", "Narsampet"],
        "Mahabubnagar": ["Mahabubnagar", "Addakal", "Balanaga", "Bhoothpur", "C.C.Kunta", "Devarakadra", "Gandeed", "Hanwada", "Jadcherla", "Koilkonda", "Midjjil", "Moosapet", "Nawabpet", "Rajapur", "Mohammadabad"],
        "Mancherial": ["Mancherial", "Mandamarri"],
        "Medak": ["Medak", "Sangareddy"],
        "Medchal Malkajgiri": ["Medchal", "Malkajgiri"],
        "Mulugu": ["Mulugu", "Wenlock"],
        "Nagarkurnool": ["Nagarkurnool", "Achampet"],
        "Nalgonda": ["Nalgonda", "Miryalaguda"],
        "Narayanpet": ["Narayanpet", "Kudallur"],
        "Nirmal": ["Nirmal", "Armur"],
        "Nizamabad": ["Nizamabad", "Bodhan"],
        "Pedapalli": ["Pedapalli", "Manthani"],
        "Rajanna Sircilla": ["Sircilla", "Vemulawada"],
        "Rangareddy": ["Shamshabad", "Chevella"],
        "Sangareddy": ["Sangareddy", "Narsapur"],
        "Siddipet": ["Siddipet", "Gajwel"],
        "Suryapet": ["Suryapet", "Kodad"],
        "Vikarabad": ["Vikarabad", "Mominpet"],
        "Wanaparthy": ["Wanaparthy", "Pebbair"],
        "Warangal Rural": ["Warangal Rural", "Duggondi"],
        "Warangal Urban": ["Warangal Urban", "Hanamkonda"],
        "Yadadri Bhuvanagiri": ["Bhuvanagiri", "Choutuppal"]    
    },
    
    "Karnataka": {
        "Bangalore": ["Cubbon Park", "Bangalore Palace"]
    },
    "Tamil Nadu": {
        "Chennai": ["Marina Beach", "Mylapore"],
        "Coimbatore": ["Gandhipuram", "RS Puram"]
    },
    "Kerala": {
        "Thiruvananthapuram": ["Lalitha Palace", "Kuthiramalika"],
        "Ernakulam": ["Fort Kochi", "Marine Drive"]
    },
    "Goa": {
        "North Goa": ["Panaji", "Mapusa"],
        "South Goa": ["Margao", "Canacona"]
    },
    "Arunachal Pradesh": {
        "East Kameng": ["Bomdila", "Seppa"],
        "West Kameng": ["Anini", "Daporijo"]
    },
    "Assam": {
        "Guwahati": ["Kamakhya Temple", "Sivasagar"]
    },
    "Bihar": {
        "Patna": ["Golghar", "Patna Museum"],
        "Gaya": ["Bodh Gaya", "Vishnupad Temple"]
    },
    "chhattisgarh": {
        "Raipur": ["Nandan Van Zoo", "Purkhouti Muktangan"],
        "Bilaspur": ["Achanakmar Wildlife Sanctuary", "Ratanpur"]
    },
    "Gujarat": {
        "Ahmedabad": ["Sabarmati Ashram", "Kankaria Lake"],
        "Surat": ["Dumas Beach", "Sarthana Nature Park"]
    }, 
    "Haryana": {
        "Gurgaon": ["Cyber Hub", "Sultanpur National Park"],
        "Faridabad": ["Surajkund Mela", "Badkhal Lake"]
    }
};

const hallDetails = {

    "Telangana": {

        "Mahabubnagar": {

            "Addakal": [

                {
                    name: "GK Function Hall",
                    location: "Addakal Main Road",
                    map: "https://maps.google.com",
                    image: "images/gk-hall.jpg"
                },

                {
                    name: "Royal Convention Hall",
                    location: "Near Addakal Bus Stand",
                    map: "https://maps.google.com"
                }

            ],

            "Balanaga": [

                {
                    name: "Sai Function Hall",
                    location: "Balanaga Center",
                    map: "https://maps.google.com"
                }

            ]
        }
    }
};
 


// Hall Selection Functions
window.addEventListener("DOMContentLoaded", () => {
    initHallSelectors();
});
        function initHallSelectors() {
            document.getElementById('state').addEventListener('change', updateDistricts);
            document.getElementById('district').addEventListener('change', updateMandals);
            document.getElementById('mandal').addEventListener('change', showHalls);
        }

        function updateDistricts() {
            const state = document.getElementById('state').value;
            const districtSelect = document.getElementById('district');
            
            districtSelect.innerHTML = '<option value="">Select District</option>';
            document.getElementById('mandal').innerHTML = '<option value="">Select Mandal</option>';
            document.getElementById('hallsList').style.display = 'none';
            
            if (state && hallData[state]) {
                Object.keys(hallData[state]).forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
            }
        }

        function updateMandals() {
            const state = document.getElementById('state').value;
            const district = document.getElementById('district').value;
            const mandalSelect = document.getElementById('mandal');
            console.log(hallData[state][district]);
            mandalSelect.innerHTML = '<option value="">Select Mandal</option>';
            
         if (state && district) {

        hallData[state][district].forEach(mandal => {

        let option =
            document.createElement("option");

            option.value = mandal;
            option.textContent = mandal;

            mandalSelect.appendChild(option);
         });
            }
        }

        async function showHalls(){

const state=document.getElementById("state").value;

const district=document.getElementById("district").value;

const mandal=document.getElementById("mandal").value;

const bookingDate=document.getElementById("hallEventDate").value;

const shift=document.querySelector(
'input[name="hallShift"]:checked'
)?.value;

if(
!state||
!district||
!mandal||
!bookingDate||
!shift
){
return;
}

const response=await fetch(

`http://localhost:5000/api/halls/available?state=${state}&district=${district}&mandal=${mandal}&bookingDate=${bookingDate}&shift=${shift}`

);

const halls=await response.json();

const hallList=document.getElementById("hallsList");

hallList.innerHTML="";

halls.forEach(hall=>{

hallList.innerHTML+=`

<div class="hall-card">

<img src="${hall.image}">

<h4>${hall.name}</h4>

<p>${hall.location}</p>

<button onclick="selectHall('${hall._id}')">

Book Hall

</button>

</div>

`;

});

}
    
                

       hallsList.style.display = "flex";
        function selectHall(hallId) {
        
            selectedHall = hallId;
            Swal.fire(
               "Hall Selected",
        hallName,
        "success"
    );

    document.getElementById("confirmHallSection")
    .classList.remove("d-none");  
        }

function confirmHallBooking() {

    if (!selectedHall) {

        Swal.fire(
            "Error",
            "Please Select a Hall",
            "error"
        );
        return;
    }

    const eventDate =
        document.getElementById("hallEventDate").value;

    if (!eventDate) {

        Swal.fire(
            "Error",
            "Please Select Event Date",
            "error"
        );
        return;
    }

    const selectedDate =
        new Date(eventDate);

    const today =
        new Date();

    const diffDays =
        (selectedDate - today) /
        (1000 * 60 * 60 * 24);

    if (diffDays < 30) {

        Swal.fire({
            icon: "warning",
            title: "Online Booking Closed",
            html: `
                Event date is within 1 month.<br><br>
                Please contact Customer Care:<br>
                📞 +91 9876543210
            `
        });

        return;
    }
    const shift =
document.querySelector(
'input[name="hallShift"]:checked'
)?.value;

if (!shift) {

    Swal.fire(
        "Error",
        "Please Select Shift",
        "error"
    );

    return;
}
   
async function openPayment() {
    const response = await fetch("http://localhost:5000/api/bookings",{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:localStorage.getItem("token")

},

body: JSON.stringify({
    hallId: selectedHall,
    bookingDate: eventDate,
    shift: shift
})
});
}}




// -----------------------------
// Event Booking Validation
// -----------------------------
document.getElementById("eventForm")?.addEventListener("submit", function (e) {

    e.preventDefault();

    let eventDate =
        document.getElementById("eventDate").value;

    let selectedDate =
        new Date(eventDate);

    let today =
        new Date();

    let diffDays =
        (selectedDate - today) /
        (1000 * 60 * 60 * 24);

    if (diffDays < 30) {

        Swal.fire(
            "Booking Closed",
            "Online booking is closed because the event date is within one month. Please contact customer care.",
            "warning"
        );

        return;
    }

    Swal.fire(
        "Success",
        "Booking Created Successfully",
        "success"
    );

});



// -----------------------------
// Travel Booking
// -----------------------------
document.getElementById("travelForm")?.addEventListener("submit", function (e) {

    e.preventDefault();

    let fromDate =
        document.getElementById("fromDate").value;

    let toDate =
        document.getElementById("toDate").value;

    if (!fromDate || !toDate) {

        Swal.fire(
            "Error",
            "Select Travel Dates",
            "error"
        );

        return;
    }

    let start =
        new Date(fromDate);

    let end =
        new Date(toDate);

    let diff =
        Math.ceil(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );

    if (diff <= 0) {

        Swal.fire(
            "Error",
            "Invalid Dates",
            "error"
        );

        return;
    }

    let packageCost = 5000;

    let total = diff * packageCost;

    Swal.fire({
        title: "Booking Confirmed",
        html: `
            Days: ${diff}<br>
            Total Cost: ₹${total}
        `,
        icon: "success"
    });
    saveBooking(
    "Travel Booking",
    {
        fromDate,
        toDate,
        totalAmount: total
    }
);
});

const touristPlaces = {

    "Telangana": [

        {
            name: "Charminar",
            image: "images/charminar.jpg",
            location: "Hyderabad",
            map: "https://maps.google.com/?q=Charminar"
        },

        {
            name: "Golconda Fort",
            image: "images/golconda.jpg",
            location: "Hyderabad",
            map: "https://maps.google.com/?q=Golconda+Fort"
        }

    ],

    "Andhra Pradesh": [

        {
            name: "Tirupati",
            image: "images/tirupati.jpg",
            location: "Tirupati",
            map: "https://maps.google.com/?q=Tirupati"
        },

        {
            name: "Araku Valley",
            image: "images/araku.jpg",
            location: "Visakhapatnam",
            map: "https://maps.google.com/?q=Araku+Valley"
        }

    ]

};



function selectTravelPlace(placeName) {

    if (!selectedPlaces.includes(placeName)) {

        selectedPlaces.push(placeName);

        updateSelectedPlaces();

        Swal.fire(
            "Selected",
            placeName,
            "success"
        );
    }
}


document
.getElementById("travelDistrict")
.addEventListener("change", showTouristPlaces);

function showTouristPlaces() {

    const state =
        document.getElementById("travelDistrict").value;

    const container =
        document.getElementById("travelPlacesList");

    container.innerHTML = "";

    selectedPlaces = [];

    if (!touristPlaces[state]) return;

    touristPlaces[state].forEach(place => {

        container.innerHTML += `

        <div class="col-md-4 mb-3">

            <div class="card p-2">

                <img src="${place.image}"
                     class="img-fluid rounded"
                     style="height:200px;object-fit:cover;">

                <h5 class="mt-2">
                    ${place.name}
                </h5>

                <p>
                    📍 ${place.location}
                </p>

                <a href="${place.map}"
                   target="_blank"
                   class="btn btn-info mb-2">
                   View Location
                </a>

                <button class="btn btn-success"
                    onclick="selectTravelPlace('${place.name}')">

                    Select Place

                </button>

            </div>

        </div>
        `;
    });
}

function updateSelectedPlaces() {

    const div =
        document.getElementById("selectedPlaces");

    div.innerHTML = "";

    selectedPlaces.forEach(place => {

        div.innerHTML += `
            <span class="badge bg-primary m-1">
                ${place}
            </span>
        `;
    });
}

function confirmTravelBooking() {

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;

    if (selectedPlaces.length === 0) {

        Swal.fire(
            "Error",
            "Select at least one place",
            "error"
        );

        return;
    }

    let totalAmount = selectedPlaces.length * 3000;

const travelServices = selectedPlaces.map(place => ({
    name: place,
    amount: 3000
}));

previousPage = "TravelBooking";

fetch("http://localhost:5000/api/payment/create-order")

    previousPage = "HallBooking";

}


//!---other bokking
document.getElementById("customEventBtn")
.addEventListener("click", () => {

    const text =
        document.getElementById(
            "customEventText"
        ).value;

    if (!text) {
        Swal.fire(
            "Error",
            "Enter Event Details",
            "error"
        );
        return;
    }

    saveBooking(
        "Custom Event",
        {
            description: text
        }
    );

    Swal.fire(
        "Success",
        "Event Submitted",
        "success"
    );

});




// -----------------------------
// PDF Generator Example
// -----------------------------

function generateBookingId(){

    return "GK" +
           Date.now().toString().slice(-8);
}

function generatePDF(bookingId){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(0,102,204);

    doc.text(
        "GK EVENT MANAGEMENT",
        20,
        y
    );

    y += 15;

    doc.setFontSize(12);

    doc.text(
        "Booking Receipt",
        20,
        y
    );

    y += 10;

    doc.text(
        "Booking ID : " + bookingId,
        20,
        y
    );

    y += 10;

    currentBookingDetails.forEach(item => {

        doc.text(
            `${item.name} - Rs.${item.amount}`,
            20,
            y
        );

        y += 8;
    });

    y += 10;

    doc.text(
        "Booking Charges : Rs.75",
        20,
        y
    );

    y += 10;

    doc.setFontSize(16);

    doc.text(
        "Total Amount : Rs." +
        document.getElementById("payableAmount")
        .textContent,
        20,
        y
    );

    window.generatedPdf = doc;
}

// -----------------------------
// Search Bar
// -----------------------------
document.querySelector('input[placeholder="Search Services"]')
?.addEventListener("keyup", function () {

    let value =
        this.value.toLowerCase();

    document
        .querySelectorAll(".service-card")
        .forEach(card => {

            let text =
                card.innerText.toLowerCase();

            card.style.display =
                text.includes(value)
                    ? "block"
                    : "none";
        });
});

// -----------------------------
// Welcome Notification
// -----------------------------
setTimeout(() => {

    if (dashboardPage &&
        !dashboardPage.classList.contains("d-none")) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Welcome to GK Event Management",
            timer: 3000,
            showConfirmButton: false
        });
    }

}, 4000);

// Start Booking Buttons

document.getElementById("EventBookingBtn").addEventListener("click", function () {
    document.getElementById("Home").classList.add("d-none");
    document.getElementById("EventBooking").classList.remove("d-none");
});

document.getElementById("HallBookingBtn").addEventListener("click", function () {
    document.getElementById("Home").classList.add("d-none");
    document.getElementById("HallBooking").classList.remove("d-none");
});

document.getElementById("TravelBookingBtn").addEventListener("click", function () {
    document.getElementById("Home").classList.add("d-none");
    document.getElementById("TravelBooking").classList.remove("d-none");
});


// ======================
// Menu Toggle
// ======================
function toggleMenu() {

    document
        .getElementById("sideMenu")
        .classList.toggle("show");
}

// Navigation Functions
      
function showSection(sectionId) {

    const sections = [
        "Home",
        "EventBooking",
        "MarriageServices",
        "BirthdayServices",
        "SareeServices",
        "DawathServices",
        "HallBooking",
        "TravelBooking",
        "MyBooking",
        "PaymentSection",
        "BookingSuccess"
    ];

    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add("d-none");
    });

    const target =
    document.getElementById(sectionId);

    if(target){
        target.classList.remove("d-none");
    }
}

// Back Buttons
document.getElementById("backToHome1").addEventListener("click", () => {
    showSection("Home");
});

document.getElementById("backToHome2").addEventListener("click", () => {
    showSection("Home");
});

document.getElementById("backToHome3").addEventListener("click", () => {
    showSection("Home");
});


document.getElementById("backToEvents")
.addEventListener("click", () => {

    marriageServices.classList.add("d-none");

    eventBookingSection.classList.remove("d-none");

});

document.getElementById("backToBirthdayEvents")
.addEventListener("click", () => {

    birthdayServices.classList.add("d-none");

    document.getElementById("EventBooking")
    .classList.remove("d-none");

});

const backSaree =
document.getElementById("backToSareeEvents");

if (backSaree) {

    backSaree.addEventListener("click", () => {

        sareeServices.classList.add("d-none");

        document
            .getElementById("EventBooking")
            .classList.remove("d-none");

    });

}

const backDawath =
document.getElementById("backToDawathEvents");

if (backDawath) {

    backDawath.addEventListener("click", () => {

        dawathServices.classList.add("d-none");

        document
            .getElementById("EventBooking")
            .classList.remove("d-none");

    });

}







// MARRIAGE SERVICES PAGE
const marriageBtn = document.getElementById("marriageBtn");

const eventBookingSection =
    document.getElementById("EventBooking");

const marriageServices =
    document.getElementById("MarriageServices");

if (marriageBtn) {
    marriageBtn.addEventListener("click", () => {

    eventBookingSection.classList.add("d-none");

    marriageServices.classList.remove("d-none");
    });
}

document.getElementById("confirmMarriage")
.addEventListener("click", function () {

    let selectedServices = [];
    let totalAmount = 0;

    const services = [
        { id: "haldi", name: "Haldi", amount: 500 },
        { id: "sangeet", name: "Sangeet", amount: 500 },
        { id: "mehndi", name: "Mehndi", amount: 500 },
        { id: "baraat", name: "Baraat", amount: 500 },
        { id: "reception", name: "Reception", amount: 1000 },
        { id: "weddingPhoto", name: "Wedding Photo", amount: 1500 },
        { id: "preWedding", name: "Pre Wedding Shoot", amount: 1500 },
        { id: "weddingShoot", name: "Wedding Shoot", amount: 2000 },
        { id: "vegFood", name: "Veg Food", amount: 3000 },
        { id: "nonVegFood", name: "Non Veg Food", amount: 5000 },
        { id: "bothFood", name: "Both Food", amount: 5000 }
    ];

    services.forEach(service => {

        if (document.getElementById(service.id).checked) {

            selectedServices.push(service);

            totalAmount += service.amount;
        }
    });

    if (selectedServices.length === 0) {
        Swal.fire(
            "Error",
            "Please select at least one service",
            "error"
        );
        return;
    }

    currentBookingDetails = selectedServices;

    previousPage = "MarriageServices";

   openPayment("Marriage Services", selectedServices, totalAmount);
then(data => {

    if (!data.success) {
        Swal.fire("Error", "Unable to create payment order", "error");
        return;
    }

    // Hide current section
    document.getElementById("MarriageServices").classList.add("d-none");

    // Show payment section
    document.getElementById("PaymentSection").classList.remove("d-none");

})});
  

// =========================
// BIRTHDAY SERVICES PAGE
// =========================

const birthdayBtn =
document.getElementById("birthdayBtn");

const birthdayServices =
document.getElementById("BirthdayServices");

if (birthdayBtn) {

    birthdayBtn.addEventListener("click", () => {

        document
            .getElementById("EventBooking")
            .classList.add("d-none");

        birthdayServices.classList.remove("d-none");

    });

}

document.getElementById("confirmBirthday")
.addEventListener("click", function () {

    let selectedServices = [];
    let totalAmount = 0;

    const services = [
        { id: "balloonDecor", name: "Balloon Decoration", amount: 1500 },
        { id: "stageDecor", name: "Stage Decoration", amount: 1500 },
        { id: "themeDecor", name: "Theme Decoration", amount: 1500 },
        { id: "djMusic", name: "DJ Music", amount: 2500 },
        { id: "magicShow", name: "Magic Show", amount: 3000 },
        { id: "games", name: "Kids Games", amount: 3000 },
        { id: "cake", name: "Birthday Cake", amount: 1000 },
        { id: "vegMenu", name: "Veg Food", amount: 4000 },
        { id: "nonVegMenu", name: "Non-Veg Food", amount: 1000 },
        { id: "bothBirthdayFood", name: "Both", amount: 4000 },
        { id: "birthdayPhoto", name: "Photography", amount: 2000 },
        { id: "pre-birthdayshoot", name: "Pre-Brithday Shoot", amount: 2000 },
        { id: "birthdayvideo", name: "Videography", amount: 2000 }
        
    ];

    services.forEach(service => {

        if(document.getElementById(service.id)?.checked){

            selectedServices.push(service);
            totalAmount += service.amount;
        }

    });

    if(selectedServices.length === 0){
        Swal.fire("Error","Select at least one service","error");
        return;
    }

    previousPage = "BirthdayServices";

   fetch("http://localhost:5000/api/payment/create-order")
});


// =========================
// SAREE FUNCTION SERVICES
// =========================

const sareeBtn =
document.getElementById("sareeBtn");

const sareeServices =
document.getElementById("SareeServices");

if (sareeBtn) {

    sareeBtn.addEventListener("click", () => {

        document
            .getElementById("EventBooking")
            .classList.add("d-none");

        sareeServices.classList.remove("d-none");

    });

}

document.getElementById("confirmSaree")
.addEventListener("click", function () {

    let selectedServices = [];
    let totalAmount = 0;

    const services = [
        { id: "sareeStage", name: "Stage Decoration", amount: 5000 },
        { id: "flowerDecor", name: "Flower Decoration", amount: 6000 },
        { id: "ledDecor", name: "LED Decoration", amount: 7000 },
        { id: "sareePhoto", name: "Photography", amount: 10000 },
        { id: "preSareeShoot", name: "Pre-Shoot", amount: 10000 },
        { id: "sareeVideo", name: "Videography", amount: 10000 },
        { id: "sareeVeg", name: "Veg Food", amount: 10000 },
        { id: "sareeNonVeg", name: "Non-veg Food ", amount: 10000 },
        { id: "bothSareeFood", name: "Both ", amount: 10000 },
        { id: "djSystem", name: "DJ Sound System", amount: 10000 },
        { id: "liveMusic", name: "Live Music", amount: 10000 },
        { id: "welcomeGuests", name: "Welcome Arrangements", amount: 10000 },
        { id: "giftCounter", name: "Gift Counter", amount: 10000 },
        { id: "returnGifts", name: "Return Gift", amount: 10000 }
    ];

    services.forEach(service => {

        if(document.getElementById(service.id)?.checked){

            selectedServices.push(service);
            totalAmount += service.amount;
        }

    });

    if(selectedServices.length === 0){
        Swal.fire("Error","Select at least one saree","error");
        return;
    }

    previousPage = "SareeServices";

   fetch("http://localhost:5000/api/payment/create-order")

});



// =========================
// DAWATH FUNCTION SERVICES
// =========================

const dawathBtn =
document.getElementById("dawathBtn");

const dawathServices =
document.getElementById("DawathServices");

if (dawathBtn) {

    dawathBtn.addEventListener("click", () => {

        document
            .getElementById("EventBooking")
            .classList.add("d-none");

        dawathServices.classList.remove("d-none");

    });

}

document.getElementById("confirmDawath")
.addEventListener("click", function () {

    let selectedServices = [];
    let totalAmount = 0;

    const services = [
        { id: "dawathVegFood", name: "Veg Food", amount: 5000 },
        { id: "dawathNonVegFood", name: "Non-Veg Food", amount: 4000 },
        { id: "bothDawathFood", name: "Both", amount: 3000 },
        { id: "stageDecorDawath", name: "Stage Decoration", amount: 2000 },
        { id: "flowerDecorDawath", name: "Flower Decoration", amount: 1500 },
        { id: "lightingDecor", name: "Lighting Decoration", amount: 1500 },
        { id: "dawathPhoto", name: "Photography", amount: 1500 },
        { id: "dawathVideo", name: "Videography", amount: 1500 },
        { id: "dronePhotography", name: "Drone Coverage", amount: 1500 },
        { id: "guestSeating", name: "Guest Seating", amount: 1500 },
        { id: "vipSeating", name: "VIP Seating", amount: 1500 },
        { id: "welcomeTeam", name: "Welcome Team", amount: 1500 },
        { id: "micSystem", name: "Wireless Mic", amount: 1500 },
        { id: "speakerSystem", name: "Speaker System", amount: 1500 },
        { id: "liveAnnouncements", name: "Live Announcements", amount: 1500 }
    ];

    services.forEach(service => {

        if(document.getElementById(service.id)?.checked){

            selectedServices.push(service);
            totalAmount += service.amount;
        }

    });

    if(selectedServices.length === 0){
        Swal.fire("Error","Select at least one service","error");
        return;
    }

    previousPage = "DawathServices";

   fetch("http://localhost:5000/api/payment/create-order")

});



function loadBookings() {

    const bookings =
        JSON.parse(localStorage.getItem("myBookings")) || [];

    const bookingList =
        document.getElementById("bookingList");

    bookingList.innerHTML = "";

    if (bookings.length === 0) {
        bookingList.innerHTML =
            "<p>No Bookings Found</p>";
        return;
    }

    bookings.forEach(booking => {

        bookingList.innerHTML += `
            <div class="card mb-2 p-2">
                <h5>${booking.type}</h5>
                <p>${JSON.stringify(booking)}</p>
            </div>
        `;

    });
}

function setupFoodSelection(vegId, nonVegId, bothId) {

    const veg = document.getElementById(vegId);
    const nonVeg = document.getElementById(nonVegId);
    const both = document.getElementById(bothId);

    if (!veg || !nonVeg || !both) return;

    function checkBoth() {

        if (veg.checked && nonVeg.checked) {

            both.checked = true;

            veg.checked = false;
            nonVeg.checked = false;
        }
    }

    veg.addEventListener("change", checkBoth);
    nonVeg.addEventListener("change", checkBoth);

    both.addEventListener("change", function () {

        if (both.checked) {

            veg.checked = false;
            nonVeg.checked = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

    setupFoodSelection("vegFood", "nonVegFood", "bothFood");

    setupFoodSelection("vegMenu", "nonVegMenu", "bothBirthdayFood");

    setupFoodSelection("sareeVeg", "sareeNonVeg", "bothSareeFood");

    setupFoodSelection("dawathVegFood", "dawathNonVegFood", "bothDawathFood");
});


// -----------------------------
// Payment Function
// -----------------------------

function openPayment(type, details, amount) {

    currentBookingType = type;
    currentBookingDetails = details;
    currentAmount = amount;

    showSection("PaymentSection");

    document.getElementById("paymentSummary").innerHTML = `
        <h4>${type}</h4>
        <p>${details}</p>
    `;

   document.getElementById("payBtn").addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/api/payment/verify");
    const data = await response.json();
});

}

// -----------------------------
// Pay Now Button
// -----------------------------

document.getElementById("confirmPaymentBtn").addEventListener("click", function () {

    let bookingId = "GK" + Date.now();

    let bookingData = {
        bookingId: bookingId,
        type: currentBookingType,
        details: currentBookingDetails,
        amount: currentAmount,
        date: new Date().toLocaleString()
    };

    localStorage.setItem(
        "latestBooking",
        JSON.stringify(bookingData)
    );

    showBookingSuccess(bookingData);
});


// -----------------------------
// Payment  page
// -----------------------------

function openPayment(serviceName, selectedItems, totalAmount) {

    showSection("PaymentSection");

    let html = `
        <h4>${serviceName}</h4>
        <hr>
    `;

    selectedItems.forEach(item => {

        html += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name}</span>
                <span>₹${item.amount}</span>
            </div>
        `;
    });

    html += `
        <hr>
        <h4>
            Total Amount : ₹${totalAmount}
        </h4>
    `;

    document.getElementById("paymentSummary")
    .innerHTML = html;

    bookingTotal = totalAmount;

document.getElementById("paymentAmount").textContent =
totalAmount;

document.getElementById("payableAmount").textContent =
totalAmount + bookingCharges;
if(payableAmount){
    payableAmount.textContent =
    totalAmount + bookingCharges;


}
}
function backFromPayment() {

    if (previousPage) {
        showSection(previousPage);
    } else {
        showSection("Home");
    }

}

function toggleService(name, amount, checkbox) {

    if (checkbox.checked) {

        selectedServices.push({
            name: name,
            amount: amount
        });

    } else {

        selectedServices = selectedServices.filter(
            service => service.name !== name
        );
    }
}

function updatePaymentAmount() {

    let payable = 0;

    if(document.getElementById("fullPayment").checked){

        payable = bookingTotal + bookingCharges;

    } else if(document.getElementById("halfPayment").checked){

        payable = (bookingTotal / 2) + bookingCharges;

    } else if(document.getElementById("officePayment").checked){

        payable = bookingCharges;
    }

    document.getElementById("payableAmount").textContent =
    Math.round(payable);
}

function showPaymentFields(){

    if(document.getElementById("upiMethod").checked){

        document.getElementById("upiSection")
        .classList.remove("d-none");

        document.getElementById("cardSection")
        .classList.add("d-none");

    } else {

        document.getElementById("upiSection")
        .classList.add("d-none");

        document.getElementById("cardSection")
        .classList.remove("d-none");
    }
}

document.getElementById("downloadReceiptBtn").addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();

    let booking =
        JSON.parse(localStorage.getItem("latestBooking"));

    doc.setFontSize(18);
    doc.text("GK EVENT MANAGEMENT", 20, 20);

    doc.setFontSize(12);
    doc.text("Booking ID: " + booking.bookingId, 20, 40);
    doc.text("Service: " + booking.type, 20, 50);
    doc.text("Details: " + booking.details, 20, 60);
    doc.text("Amount Paid: ₹" + booking.amount, 20, 70);
    doc.text("Date: " + booking.date, 20, 80);

    doc.save("GK_Booking_Receipt.pdf");
});


function showBookingSuccess(data) {

    showSection("BookingSuccess");

    document.getElementById("bookingIdDisplay").innerHTML =
        "Booking ID: <strong>" + data.bookingId + "</strong>";

    document.getElementById("bookingDetailsDisplay").innerHTML = `
        <h5>Booking Details</h5>

        <p><strong>Service:</strong> ${data.type}</p>

        <p><strong>Details:</strong> ${data.details}</p>

        <p><strong>Amount Paid:</strong> ₹${data.amount}</p>

        <p><strong>Date:</strong> ${data.date}</p>
    `;
}


loginPage.classList.remove("d-none");
signupPage.classList.add("d-none");
otpPage.classList.add("d-none");
dashboardPage.classList.add("d-none");