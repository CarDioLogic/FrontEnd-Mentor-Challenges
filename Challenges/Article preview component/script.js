//button 1
document.getElementById('shareBtn').addEventListener('click', () =>{
console.log("button clicked");

    let userProfile = document.getElementById('userProfileFooter');
    let shareFooter = document.getElementById('shareFooter');


    
    if (window.innerWidth <= 400) {

        userProfile.classList.add('hidden');
        shareFooter.classList.remove('hidden'); 
        document.getElementById('shareBtnV2').classList.remove('hidden');

    } else {

        if(shareFooter.title === "hidden"){
            shareFooter.classList.remove('hidden');
            shareFooter.title = "show"
            document.getElementById('shareBtnV2').classList.add('hidden');
        } else {
            shareFooter.title = "hidden"
            shareFooter.classList.add('hidden');
        }

    }
});

//button 2
document.getElementById('shareBtnV2').addEventListener('click', () =>{
    console.log("button clicked");
    
        let userProfile = document.getElementById('userProfileFooter');
        let shareFooter = document.getElementById('shareFooter');
    
        userProfile.classList.remove('hidden');
        shareFooter.classList.add('hidden');  
    });

