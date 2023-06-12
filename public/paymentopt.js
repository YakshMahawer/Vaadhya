function cardShow(){
    document.getElementsByClassName("card")[0].style.display = 'block';
    document.getElementsByClassName("upi")[0].style.display = 'none';
    document.getElementsByClassName("netbanking")[0].style.display = 'none';
    document.getElementById('cardBut').style.backgroundColor = "#6930ca";
    document.getElementById('cardBut').style.color = 'white';
    document.getElementById('upiBut').style.backgroundColor = "white";
    document.getElementById('upiBut').style.color = '#6930ca';
    document.getElementById('netbBut').style.backgroundColor = "white";
    document.getElementById('netbBut').style.color = '#6930ca';

}
function upiShow(){
    document.getElementsByClassName("card")[0].style.display = 'none';
    document.getElementsByClassName("upi")[0].style.display = 'block';
    document.getElementsByClassName("netbanking")[0].style.display = 'none';
    document.getElementById('upiBut').style.backgroundColor = "#6930ca";
    document.getElementById('upiBut').style.color = 'white';
    document.getElementById('cardBut').style.backgroundColor = "white";
    document.getElementById('cardBut').style.color = '#6930ca';
    document.getElementById('netbBut').style.backgroundColor = "white";
    document.getElementById('netbBut').style.color = '#6930ca';
}
function netbShow(){
    document.getElementsByClassName("card")[0].style.display = 'none';
    document.getElementsByClassName("upi")[0].style.display = 'none';
    document.getElementsByClassName("netbanking")[0].style.display = 'block';
    document.getElementById('netbBut').style.backgroundColor = "#6930ca";
    document.getElementById('netbBut').style.color = 'white';
    document.getElementById('upiBut').style.backgroundColor = "white";
    document.getElementById('upiBut').style.color = '#6930ca';
    document.getElementById('cardBut').style.backgroundColor = "white";
    document.getElementById('cardBut').style.color = '#6930ca';
}
async function getLink(){
    try{
        const ses = document.getElementById('sessionIn').value;
        let res = await fetch(`http://localhost:8000/upiid/${ses}`);
        let random = await res.json();
        document.getElementById('gpay').href = random.data.payload.gpay;
        document.getElementById('paytm').href = random.data.payload.paytm;
        document.getElementById('phonepe').href = random.data.payload.phonepe;
        document.getElementById('apay').href = random.data.payload.default;
        document.getElementById('bhim').href = random.data.payload.bhim;
        console.log(random.data.payload.bhim);
    }
    catch{
        console.log(err);
    }
}

function viabank(bankid){
    const ses = document.getElementById('sessionIn').value;
    location.href = `/pay/${ses}/${bankid}`;
}

async function expOrNot(){
    const order = document.getElementById('orderIn').value;
    let res = await fetch(`http://localhost:8000/check/${order}`);
    let status = await res.json();
    console.log(status);
}
cardShow();
getLink();