
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = canvas.width = window.innerWidth;
  const CANVAS_HEIGHT = canvas.height = window.innerHeight;
 
  
  const idleImg = new Image();
  idleImg.src = "assets/Idle.png";
  const runImg = new Image();
  runImg.src = "assets/Run.png";
  const shootImg = new Image();
  shootImg.src = "assets/Shot_1.png";
  const rechargeImg = new Image();
  rechargeImg.src = "assets/recharge.png";
  const deadImg = new Image();
  deadImg.src = "assets/Dead.png";
  //flipped version
  const deadImgL = new Image();
  deadImgL.src = "assets/DeadLeft.png";
  const rechargeImgL = new Image();
  rechargeImgL.src = "assets/RechargeLeft.png";
  const idleImgL = new Image();
  idleImgL.src = "assets/IdleLeft.png";
  const runImgL = new Image();
  runImgL.src = "assets/RunLeft.png";
  const shootImgL = new Image();
  shootImgL.src = "assets/ShotLeft.png";

  const zombie_dead = new Image();
  zombie_dead.src = "assets/zombie_dead.png";
  const zombie_deadLeft = new Image();
  zombie_deadLeft.src = "assets/zombie_deadLeft.png";
  const zombie_attack = new Image();
  zombie_attack.src = "assets/zombie_attack.png";
  const zombie_attackLeft = new Image();
  zombie_attackLeft.src = "assets/zombie_attackLeft.png";
  const zombie_walk = new Image();
  zombie_walk.src = "assets/zombie_walk.png";
  const zombie_walkLeft = new Image();
  zombie_walkLeft.src = "assets/zombie_walkLeft.png";
  const zombie_idle = new Image();
  zombie_idle.src = "assets/zombie_idle.png";
  const zombie_idleLeft = new Image();
  zombie_idleLeft.src = "assets/zombie_idleLeft.png";

  let zombie_= zombie_walk;
  let zombie_maxFrames =8;
  const bulletImg = new Image();
  bulletImg.src ="assets/bullet.png";
  bulletImg.width = 25;
  bulletImg.height = 25;
  const bulletImgL = new Image();
  bulletImgL.src ="assets/bulletLeft.png";
  bulletImgL.width = 25;
  bulletImgL.height = 25;
  
  let zombie_rightMovement =true;
  let zombie_leftMovement;
  let zombie_animationFrameId ;
  let zombies =[];
 
  let once = false;
  let previousX = 0;
  let previousY = 0;
  let zombiePreviousX =0;
  let zombiePreviousY =0;
  let zombieX =[];
  let animationFrameId;
  let isJumping = false;
  let isShooting = false;
  let isFalling = false; 
  const jumpHeight = 100;
  let isRunning =false;
  let wasOnBlock =false;
  let velocity = 27;//velocity of bullet
  let time =0;
  let onBlockVar;
  let piRatio = Math.PI/180;
  let maxHeight;
  let leftMovement;
  let zombie_initial_position = true;
  let rightMovement =true;
  let isWalking;
  let initial_generation = true;
  
 
  const gravityValue = 2;
  const screenWidth = window.innerWidth; 
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize); 
  // console.log(remSize);
  
  const widthOfBlock = screenWidth >= 1024 ? 8.5 * remSize : 7.5 * remSize; 
  const heightOfSmallBlock = 6.25 * remSize; 
  const heightOfBigBlock = 12.5 * remSize; 
  const space = 1 ;
  // console.log(widthOfBlock,heightOfBigBlock,heightOfSmallBlock,screenWidth);
 
  const a =400;
  const b = 1000;

  const blocks = [
    { x: a, height: heightOfSmallBlock },
    { x: a + space + widthOfBlock, height: heightOfBigBlock },
    // { x: a + 2*space + 2* widthOfBlock, height: heightOfSmallBlock },
    { x: b, height: heightOfSmallBlock },
    // { x: c, height: heightOfSmallBlock },
    { x: b + widthOfBlock + space, height: heightOfBigBlock }
  ];


  function applyGravity() {
    if (previousY > 0) {
     
      previousY -= gravityValue;
      // applyGravity();
    } else {
      previousY = 0;
      onBlockVar =false;
      isFalling = false; 
      // console.log("isfalling in applyGravity set to false");
    }
  }
 

  function onBlock(x, y, width, height) {
     onBlockVar = false;
    //  console.log( x + width*0.6, widthOfBlock*0.4 ,x);
    for(let block of blocks){
      
      if (block.x  < x + width && block.x + widthOfBlock > x) {
       
       
        if ((y + 6.25 *remSize == block.height && rightMovement||( (block.height + 6.25 *remSize == y || y + 12.5 *remSize == block.height) && leftMovement))  && isFalling == false){
          
          previousX = block.x -2*remSize;
          previousY =  block.height ;
          onBlockVar = true;
          isJumping = false;
          isFalling = false;
          // console.log(y+height == block.height + 9.75 *remSize, y == block.height + 6.25 * remSize);
          // console.log("onblock called",onBlockVar);
          wasOnBlock = true;
         
          // console.log(y+height,block.height,CANVAS_HEIGHT-block.height+gravityValue,y);
          break;
        }
      }
     
    }
    if (!onBlockVar) {
      isFalling = true;
      isJumping = false;
      // console.log("gravity");
      if(wasOnBlock){
        if(rightMovement){
        previousX = previousX + widthOfBlock;
        console.log(rightMovement);
        }else{
          previousX = previousX - widthOfBlock;
        }
       
        wasOnBlock = false;
      }
      applyGravity();
    }
  }

  class Movements {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.spriteWidth = 128;
      this.spriteHeight = 128;
      this.height = this.spriteHeight*2;
      this.width = this.spriteWidth*2;
      this.frame =0;
      this.speed = 5;
      
    }
    collision(){
      blocks.forEach(block =>{
       
        if(block.x + widthOfBlock*0.4  > this.x  && block.x  < this.x + this.width*0.6){
         
          isRunning = false;
            return true;
            //collision
        }
        
      })
      return false;
    }
    
  
 
    update(maxFrames) {
      
      this.maxFrames = maxFrames;
      if(isRunning && rightMovement){
        previousX += runSoldier.speed;
        
      }else if(isRunning && leftMovement){
        previousX -=runSoldier.speed;
      }
      
      if (isJumping || isFalling) {
        
        onBlock(this.x, this.y, this.width, this.height);
        
        // console.log(this.x,this.y);
      }
      this.x = previousX;
      this.y = previousY;

      if (rightMovement) {
        
        this.frame = (this.frame + 1) % this.maxFrames; 
      } else if (leftMovement) {
        this.frame = (this.frame - 1 + this.maxFrames) % this.maxFrames; 
      }
    
      
    }
    
    draw(image) {
      // ctx.strokeRect(this.x, CANVAS_HEIGHT - this.height - this.y, this.width, this.height);
     ctx.drawImage(image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, CANVAS_HEIGHT - this.height - this.y, this.width, this.height);
    }
  }

  class zombieMovements {
    constructor(x, y = 0, speed = 2) {
      this.x = x;
      this.y = y;
      this.spriteWidth = 96;
      this.spriteHeight = 96;
      this.height = this.spriteHeight * 2;
      this.width = this.spriteWidth * 2;
      this.frame = 0;
      this.speed = speed;
      this.isWalking = Math.random() < 0.5;
      this.time = 0;
     
    }
    update(maxFrames) {
      // Initialize time if it's not already initialized
      if (this.time === undefined || this.time >100) {
          this.time = 0;
      }
  
      this.maxFrames = maxFrames;
  
      if (this.isWalking) {
          let tooCloseToSoldier = Math.abs(previousX - this.x) < 150;
  
        if (zombie_rightMovement) {
           this.x += this.speed;
          
           if (checkCollision(this.x, this.width * 0.6) || tooCloseToSoldier) {
              
               zombie_leftMovement = true;
               zombie_rightMovement = false;
               zombie_ = zombie_walkLeft;
           } 
        } else if (zombie_leftMovement) {
          this.x -= this.speed;
          
          if (checkCollision(this.x, this.width * 0.6) || tooCloseToSoldier) {
             
              zombie_leftMovement = false;
              zombie_rightMovement = true;
              zombie_ = zombie_walk;
          }
      }     
      if (this.time % 100 === 0) {
        this.isWalking = false;
       
        zombie_ = zombie_rightMovement ? zombie_idle : zombie_idleLeft;
    }
    } else {
    if (this.time % 50 === 0) {
        this.isWalking = true;
       
        zombie_ = zombie_rightMovement ? zombie_walk : zombie_walkLeft;
    }
    }
    if (zombie_rightMovement) {
      this.frame = (this.frame + 1) % this.maxFrames; 
  } else if (zombie_leftMovement) {
      this.frame = (this.frame - 1 + this.maxFrames) % this.maxFrames; 
  }
  
  
     
      this.time++;
  }
  
  
    draw(image) {
      // ctx.strokeRect(this.x, CANVAS_HEIGHT - this.height - this.y, this.width, this.height);
      ctx.drawImage(image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, CANVAS_HEIGHT - this.height - this.y, this.width, this.height);
    }
  }
  
  let bulletY;
  let bulletX;
  let idleSoldier = new Movements();
  let deadSoldier = new Movements();
  let runSoldier = new Movements();
  let shootSoldier = new Movements();
  let rechargeSoldier = new Movements();
  let zombieWalk = new zombieMovements;
  let zombieIdle = new  zombieMovements;
  let zombieDead = new  zombieMovements;

  
   function shootBullet(width,height,theta){
    if(once){
       bulletX =previousX + width*0.6;
       bulletY =previousY +height*0.4;
       maxHeight = velocity*velocity*Math.sin(theta*piRatio)*Math.sin(theta*piRatio)/(2*gravityValue);
     
       time=0;
      once = false;
    }
   
    if(bulletY>0){
   
       if(rightMovement){
        ctx.drawImage(bulletImg,0,0,bulletImg.width,bulletImg.height,bulletX,CANVAS_HEIGHT-bulletY,bulletImg.width*3,bulletImg.height*3);
       }
      
       if(leftMovement){
        ctx.drawImage(bulletImgL,0,0,bulletImgL.width,bulletImgL.height,bulletX,CANVAS_HEIGHT-bulletY,bulletImgL.width*3,bulletImgL.height*3);
       }
      if((!onBlockVar || (onBlockVar && previousY==heightOfSmallBlock)) && bulletY>0){
        if(rightMovement){
          bulletX =  previousX + width*0.6 + velocity * Math.cos(theta*piRatio) *time;
        }else{
          bulletX =  previousX + width*0.2 - velocity * Math.cos(theta*piRatio) *time;
        }
         
        if(bulletY<=maxHeight){
        bulletY = previousY + height*0.4+ velocity * Math.sin(theta*piRatio) *time + 0.5*gravityValue*time*time;
        }else{
        bulletY = previousY + height*0.4+ velocity * Math.sin(theta*piRatio) *time - 0.5*gravityValue*time*time;
        }
     
        time++;

      }else if(onBlockVar && bulletY>0 && previousY==heightOfBigBlock){
        let velocity = 15;
        if(rightMovement){
          bulletX =  previousX + width*0.6 + velocity  *time;  //theta =0
        }else{
          bulletX =  previousX + width*0.6 - velocity  *time;  //theta =0
        }
       
        bulletY = previousY  - 0.5*gravityValue*time*time;
        
        time++;
      }

      attackZombie(bulletX,bulletY);
     
    
    }else{
     isShooting =false;
     console.log(false);
 
    }
  }


  function animate(soldier, image, maxFrames) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBlocks();
   
    function animateZombies() {
     
      zombies.forEach(zombie => {
        zombie.update(zombie_maxFrames);
        zombie.draw(zombie_);
      });
    }

    soldier.collision();
    soldier.update(maxFrames);
    soldier.draw(image);
   if(initial_generation){
    generateZombie();
    
    initial_generation =false;
   }
    animateZombies();

    if(isShooting){
      shootBullet(shootSoldier.width,shootSoldier.height,70); 
    }
    animationFrameId = requestAnimationFrame(() => animate(soldier, image, maxFrames));
  }
  animate(idleSoldier, idleImg, 7);

  document.addEventListener('keydown', function(event) {
    if (!event.ctrlKey && event.code === "KeyS") {
      once =true;
     
      isShooting =true;
      // console.log(isShooting,once);
      cancelAnimationFrame(animationFrameId);
      if(onBlockVar){
        if(rightMovement){
          animate(shootSoldier, shootImg, 4);
        }else{
          animate(shootSoldier,shootImgL,4)
        }
       
      }else{
        if(rightMovement){
          animate(rechargeSoldier,rechargeImg,1)// in this img,the gun makes an angle
        }else{
          animate(rechargeSoldier,rechargeImgL,1);
        }
       
      }
      
      // previousX = shootSoldier.x;
     
      

    } else if (event.ctrlKey && event.code === "ArrowRight") {
        rightMovement =true;
        leftMovement = false;
        // console.log(leftMovement,rightMovement);
        isRunning = true;
        cancelAnimationFrame(animationFrameId);
        animate(runSoldier, runImg, 8);
      
     
    } else if (event.ctrlKey && event.code === "ArrowLeft") {
      rightMovement =false;
      leftMovement = true;
      isRunning = true;
      cancelAnimationFrame(animationFrameId);
     
    
      animate(runSoldier, runImgL, 8);    
    
      
    }
    else if (event.code === "KeyJ" && !isJumping) {
     
      isJumping = true;
     
      previousY += 2*jumpHeight;
     
      if(rightMovement){
        animate(idleSoldier, idleImg, 7);
      }else{
        animate(idleSoldier,idleImgL,7);
      }
     
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.code === "KeyS" || event.code === "ArrowRight" || event.code ==="ArrowLeft") {
      isRunning = false;
      // console.log(rightMovement,leftMovement);
      cancelAnimationFrame(animationFrameId);
      if(rightMovement){
        animate(idleSoldier, idleImg, 7);
      }else{
        animate(idleSoldier,idleImgL,7)
      }
    //  console.log(previousX);
    }
  });

  function drawBlocks() {
    ctx.fillStyle = "yellow";
    blocks.forEach(block => {
      
      ctx.fillRect(block.x, CANVAS_HEIGHT - block.height, widthOfBlock, block.height);
    });
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * (CANVAS_WIDTH - 100));
  }
  
  function checkCollision(x, width) {
    for (let block of blocks) {
      if (x < block.x + widthOfBlock && x + width > block.x) {
        // console.log("Colliding with block at:", block.x);
        return true; // Collision with block
      }
    }
    return false;
  }
  
  function generateZombie() {
    let zombieX = zombies.map(z => z.x); // Collect x positions of existing zombies
    let attempts = 0;
  
    while (zombies.length < 4 && attempts < 100) {
      let x = generateRandomNumber();
      let colliding = checkCollision(x, 96 * 2);
      let tooCloseToOtherZombies = zombieX.some(zx => Math.abs(zx - x) < 150);
      let tooCloseToSoldier = Math.abs(previousX - x) < 150;
  
      if (!colliding && !tooCloseToOtherZombies && !tooCloseToSoldier) {
        console.log(x);
        let newZombie = new zombieMovements(x); 
        zombies.push(newZombie);
       
        zombieX.push(x);
        console.log(`New Zombie X: ${x}`);
        console.log("Zombies:", zombies.map(z => z.x));
        console.log(zombies);
      } 
      attempts++;
    }
   
  }
  
  function attackZombie(bulletX,bulletY){
    for(let zombie of zombies){
     
      let distanceX = Math.abs(zombie.x-bulletX)
      let distanceY = Math.abs(zombie.y-bulletY);
      console.log(distanceX,distanceY);
      if(distanceX < 180 && distanceY < 100){
        console.log('attack');
        updateScore();
        break;
      }
    };
  
  }
  function drawScore(score) {
   
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
   
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    
   
    const text = `Score: ${score}`;
    const textWidth = ctx.measureText(text).width;
    const xPosition = canvas.width - textWidth - 10; // 10 pixels from the right edge
    const yPosition = 100; // 30 pixels from the top edge

   
    ctx.fillText(text, xPosition, yPosition);
  }
  drawScore();
  // function updateScore() {
  //   score += 1; // Increment the score
  //   drawScore(score); // Draw the updated score
  // }
});
