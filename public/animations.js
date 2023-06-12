
function cookies(){
    const now = new Date()
	const item = {
		value: 'done',
		expiry: now.getTime() + 1000*60*60*24,
	}
	localStorage.setItem("aajkaquoata", JSON.stringify(item))
}

let animation;
window.addEventListener('load', function() {
    const itemStr = localStorage.getItem("aajkaquoata");
    if(itemStr == null){
        console.log("No cookies");
        cookies();
        animation = false;
    }
    else{
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem("aajkaquoata");
            animation = false;
            console.log("Expired making new");
            cookies();
        }
        else{
            console.log("abi hi aaya hai");
            animation = true;
        }
    }
    console.log(animation);
    if(animation){
        document.getElementsByClassName('intro')[0].style.display = 'none';
        document.getElementsByClassName('parda')[0].style.display = 'none';
        gsap.from("*",{overflow: "hidden", duration: 0.1, delay: 0}); 
    }
    else{
        gsap.from("*",{overflow: "hidden", duration: 7.5, delay: 1}); 
    }
}); 



document.getElementsByClassName('intro')[0].style.visibility = 'visible';
document.getElementsByClassName('parda')[0].style.visibility = 'visible';
gsap.to(".intro_logo", {opacity: 0, duration: 0.1, delay: 1});
gsap.from(".tonycom", {scale: 0, duration: 1,delay:1.5});
gsap.from(".tony", {scale: 0, duration: 1,delay:1.5});
gsap.from(".girlcom", {scale: 0, duration: 0.8,delay: 3.4});
gsap.from(".girltext", {opacity: 0, translateX: 20, duration: 1,delay: 3.4});
gsap.from(".hardtext", {scaleY: 0, duration: 0.55,delay: 5});
gsap.from(".hardcom", {scaleY: 0, duration: 0.65,delay: 5});
gsap.from(".vaadhya", {scaleX: 0, duration: 1.1,delay: 6.2});
gsap.from(".tagline", {scaleX: 0, duration: 1.1,delay: 6.2});
gsap.from(".jingle", {scaleX: 0, duration: 1.1,delay: 6.2});
gsap.to(".parda",{top:-1000, duration: 1.8, delay: 7.6,ease: Linear.easeNone});
gsap.to(".intro",{top:-1000, duration: 0.7, delay: 8.6});
gsap.to(".home", {opacity:1,duration: 1,delay: 8.6});
gsap.to(".skip_button",{scaleX:1.08, duration:0.5, repeat:-1,ease:Power1.easeOut, delay: 1});
gsap.to(".skip_button",{scaleY:1.006, duration:0.5, repeat:-1, delay: 1});
gsap.to("#svvg1",{ fill: "rgb(181, 16, 231)", duration: 0.5,repeat: -1, delay: 1});
gsap.to("#svvg2",{ fill: "yellow", duration: 0.5,repeat: -1, delay: 1});
gsap.to("#svvg3",{ fill: "rgb(209, 212, 10)", duration: 0.5,repeat: -1, delay: 1});
gsap.to("#svvg4",{ fill: "rgb(255, 210, 9)", duration: 0.6,repeat: -1, delay: 1});
gsap.to("#svgg1",{ fill: "rgb(221, 29, 29)", duration: 0.75,repeat: -1});
gsap.to("#svgg2",{ fill: "yellow", duration: 0.6,repeat: -1, delay: 1});
gsap.to("#ssvg1",{ fill: "rgb(240, 14, 202)", duration: 0.7,repeat: -1, delay: 1});
gsap.to("#ssvg2",{ fill: "rgb(11, 207, 11)", duration: 0.7,repeat: -1, delay: 1});
gsap.from(".girl", {translateY:34, duration: 11, delay: 1});
gsap.from(".srivalli", {translateX:38, duration: 11, delay: 1});
gsap.from(".gf", {rotation:8, duration: 9, delay: 1});
gsap.from(".boy", {rotation:-8, duration: 11, delay: 1});
var page = document.getElementsByClassName('grid')[0];
function logpage(){
     page.style.visibility = 'visible';
}
function skipIntro(){
    gsap.to(".parda",{top:-1000, duration: 1.8,ease: Linear.easeNone});
    gsap.to(".intro",{top:-1000, duration: 0.7,delay: 1});
    gsap.to(".home", {opacity:1,duration: 1,delay: 1});
    gsap.fromTo("*", {overflow: "hidden"}, {overflow: "visible", repeat: -1, delay: 1.5});
}



async function getUsers(songid) {
    var songId = songid;
    try {
        let res = await fetch(`http://localhost:8000/songs/${songId}`);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getHistory(){
    try{
        let res = await fetch(`http://localhost:8000/history`);
        return await res.json();
    }catch (error) {
        console.log(error);
    }
}

async function getSongs(wordId){
    try{
        let res = await fetch(`http://localhost:8000/find/${wordId}`);
        return await res.json();
    }
    catch(error){
        console.log(error);
    }
}

async function findSearch(){
    var search = document.getElementById('searchIn').value;
    let users = await getSongs(search);
    console.log(users);
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    document.getElementById('parent').innerHTML = '';
    $(`<div class="BackButton"><button onclick = "homePageShow()"><i class="fa-solid fa-circle-chevron-left"></i></button></div>`).prependTo($('#parent'));
    $.each(users, function(idx, obj) {
        const album_id = obj.album_id;
        const song_src = obj.song_src;
        var song_img = obj.album_img;
        var songName = obj.song_name;
        var songSinger = obj.singers;
        $(`<div class="songs"><button class = "khufiya_song_button" onclick = "curClickedSongPlay('${album_id}','${song_src}','${song_img}','${songName}','${songSinger}', '0')"></button><div class="songs_albums_img"><img src="${song_img}" alt="" srcset=""><div class="cd"></div></div><div class="song_details"><p class="song_name">${songName}</p><p class="artist_name">${songSinger}</p>
        </div></div>`).prependTo($('#parent'));     
    });
    document.getElementById('parent').style.visibility = 'visible';  
}

async function showhistory(){
    let history = await getHistory();
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    document.getElementById('parent').innerHTML = '';
    $(`<div class="BackButton"><button onclick = "homePageShow()"><i class="fa-solid fa-circle-chevron-left"></i></button></div>`).prependTo($('#parent'));
    $.each(history, function(idx, obj) {
        var songName = obj.songName;
        var songSinger = obj.songSinger;
        var songImg = obj.songAlbum;
        $(`<div class="songs"><button class = "khufiya_song_button"></button><div class="songs_albums_img"><img src="${songImg}" alt="" srcset=""><div class="cd"></div></div><div class="song_details"><p class="song_name">${songName}</p><p class="artist_name">${songSinger}</p>
        </div></div>`).prependTo($('#parent'));     
    });
    document.getElementById('parent').style.visibility = 'visible';  
}

async function plz(songid){
    let users = await getUsers(songid);
    console.log(users);
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    document.getElementById('parent').innerHTML = '';
    $(`<div class="BackButton"><button onclick = "homePageShow()"><i class="fa-solid fa-circle-chevron-left"></i></button></div>`).prependTo($('#parent'));
    $.each(users, function(idx, obj) {
        const album_id = obj.album_id;
        const song_src = obj.song_src;
        var song_img = obj.album_img;
        var songName = obj.song_name;
        var songSinger = obj.singers;
        $(`<div class="songs"><button class = "khufiya_song_button" onclick = "curClickedSongPlay('${album_id}','${song_src}','${song_img}','${songName}','${songSinger}', '0')"></button><div class="songs_albums_img"><img src="${song_img}" alt="" srcset=""><div class="cd"></div></div><div class="song_details"><p class="song_name">${songName}</p><p class="artist_name">${songSinger}</p>
        </div></div>`).prependTo($('#parent'));     
    });
    document.getElementById('parent').style.visibility = 'visible';  
}
function homePageShow(){
    document.getElementsByTagName('body')[0].style.overflow = '';
    document.getElementById('parent').style.visibility = 'hidden';
}

function showPaymentDiv(){
    document.getElementsByClassName('content')[0].style.opacity = 0.2;
    document.getElementsByClassName('paymentDiv')[0].style.visibility = 'visible'
}

function closePaymentDiv(){
    document.getElementsByClassName('content')[0].style.opacity = 1;
    document.getElementsByClassName('paymentDiv')[0].style.visibility = 'hidden'
}