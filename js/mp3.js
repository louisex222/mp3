let audio = document.querySelector('audio')
let playbtn = document.querySelector('.playbtn')
let progress = document.querySelector('.progress')
let progressBar =progress.querySelector('.progressBar')
let audioTime =progress.querySelector('span')
let btn  = playbtn.querySelector('.play')
let loop = playbtn.querySelector('.fa-undo')
let prev = playbtn.querySelector('.fa-angle-double-left')
let next = playbtn.querySelector('.fa-angle-double-right')
let list = document.querySelector('.musiclist ul')

let audios = [
    'digimon-adventure2020.mp3',
    'good-time.mp3',
    'kehlani-g-eazy-good-life.mp3',
    'op1catch-you-catch-me.mp3',
    'twice-more-more-mv.mp3'
    ]
btn.onclick=function(e){
    if(audio.paused){
        audio.play()
        btn.innerHTML = '<i class="fas fa-pause">'
        
    }else{
        audio.pause()
        btn.innerHTML = '<i class="fas fa-play">'
       
    }
   
}

function currentHandler(e){
    progressBar.style.width = e.offsetX+'px' 
    let percent = parseInt(progressBar.style.width) / progress.offsetWidth
    audio.currentTime = percent * audio.duration
}
progress.addEventListener('click',currentHandler)

// 時間更新
function timeupdate(){
    progressBar.style.width =  progress.offsetWidth*(this.currentTime/this.duration)+ 'px'
    let times = parseInt(audio.duration- audio.currentTime)
    let mins  = Math.floor(times/60)
    let secs = times%60
    audioTime.innerText = `${mins}:${secs<10?0:''}${secs}`
    
}
audio.addEventListener('timeupdate',timeupdate)

// 循環控制
function loopPlay(){
    if(audio.loop == false){
    this.style.color= '#e69494'
    audio.loop = true

    }else{
        this.style.color ='#984f4f'
        audio.loop= false
    }
}
loop.addEventListener('click',loopPlay)

let index = 0
function prevAudio(){
    index--
    if(index< 0){
        index = audios.length-1
    }
    audio.src = `/sounds/${audios[index]}` 
    audio.play()
}

prev.addEventListener('click',prevAudio)
function nextAudio(){
    index++
    if(index > audios.length-1){
        index = 0
    }
    audio.src = `/sounds/${audios[index]}`
    audio.play()
}
next.addEventListener('click',nextAudio)



audios.forEach((value,i,arr)=>{
    
    let html =`<li>
                <div>${i+1}.
                    <span>${value}</span> 
                </div>
                
               </li>`
     list.innerHTML+= html 
      
})
let listChild = list.querySelectorAll('li')

// 列表播放
let listBtn = document.querySelectorAll('li span')
function listPlay(){
    audios.forEach((value,i)=>{
        if(this.innerText == value){
            audio.src = `/sounds/${value}`
            if(listChild[i].className==''){
                listChild[i].classList.add('active')
            }
        }else if( this.innerText != value){
            listChild[i].classList.remove('active')
        }
        
        
        
        
    })
    audio.play()
}
listBtn.forEach(btn=>btn.addEventListener('click',listPlay))
// 音波
let gain = document.querySelector('.gain')
for(let i =0 ;i< 128; i++){
    gain.innerHTML +=`<div></div>`
}
let gains = document.querySelectorAll('.gain div')

let audioCtx = new(window.AudioContext)()
let source = audioCtx.createMediaElementSource(audio)
let gainNode = audioCtx.createGain()
let processor = audioCtx.createScriptProcessor(4096,1,1)
source.connect(gainNode)
gainNode.connect(processor)
processor.connect(audioCtx.destination)


processor.onaudioprocess =function(e){
    let input = e.inputBuffer.getChannelData(0);
    let output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i];
    }
    
    for(let j=0; j<128; j++){
           gains[j].style.height = output[j*32]*50+'px';
    }
}

let drag = document.querySelector('.pic')
let imgs =  drag.querySelectorAll('img')
let clicked = false
let scrollmove
let beginX
function dragDown(e){
   clicked =true
   beginX = e.pageX-drag.offsetLeft
   scrollmove = drag.scrollLeft
   console.log(scrollmove)
}
function dragMove(e){
    if(!clicked)return
        let lastX = e.pageX-drag.offsetLeft
        let move = lastX-beginX
        drag.scrollLeft = scrollmove-move
        console.log(beginX,lastX,move,scrollmove,drag.scrollLeft)
    
}
drag.addEventListener('mousemove',dragMove)
drag.addEventListener('mousedown',dragDown)
drag.addEventListener('mouseleave',function(){
    clicked = false
})
drag.addEventListener('mouseup',function(){
    clicked = false
})
function imgPlay(){
    audios.forEach((value,i)=>{
        if(this.id == i){
            audio.src = `/sounds/${value}`
        }
        audio.play()
        
    })
}
imgs.forEach(img=>img.addEventListener('dblclick',imgPlay))


audios.forEach((value,i,arr)=>{
    if(listBtn[0].innerText == value){
        audio.src = `/sounds/${value}`
        listChild[i].classList.add('active')
            
    }
    
    
})
audio.play()
