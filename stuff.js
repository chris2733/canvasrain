
setCanvasReady(300);


function setCanvasReady(rainAmount) {
   var canvas = document.querySelector('canvas');

   // setting window sizes in vars
   var windowWidth = document.querySelector('.canvasWrap').offsetWidth;
   var windowHeight = document.querySelector('.canvasWrap').offsetHeight;
   // setting canvas params
   canvas.width = windowWidth;
   canvas.height = windowHeight;
   // settings for canvas sizes stored here for later
   canvasWidth = windowWidth;
   canvasHeight = windowHeight;

   // start drawing
   var paintbrush = canvas.getContext('2d');



   // function to get a random number between 2 digits
   function getRandom(min, max) {
      return Math.random() * (max - min) + min;
   }


   // setting initial splash settings here
   var splashStartLeft = 0;
   var splashEndLeft = 0.1;
   var splashStartRight = 1;
   var splashEndRight = 1.1;



   // js object to provide all shapes
   function shapeGenerate(x, y, dy, length, splashRadius, rainColour) {
      this.x = x;
      this.y = y;
      this.dy = dy;
      this.length = length;
      // raindrops stuff
      this.raindropColour = rainColour;
      this.splashColour = rainColour;
      this.splashStartLeft = splashStartLeft;
      this.splashEndLeft = splashEndLeft;
      this.splashStartRight = splashStartRight;
      this.splashEndRight = splashEndRight;
      this.splashRadius = splashRadius;
      this.splashSpeed = 0.05;

      // draw line
      this.draw = function() {
         paintbrush.beginPath();
         paintbrush.moveTo(this.x, this.y);
         paintbrush.lineTo(this.x, this.y + this.length);
         paintbrush.strokeStyle = this.raindropColour;
         paintbrush.stroke();
      };

      // update drawing of line
      this.update = function() {
         // if meets edge of canvas
         if (this.y + this.length > canvasHeight) {
            this.dy = 0;
            this.splash();
            // this.redraw();
         }
         // get moving in first place
         this.y += this.dy;
         // speed up movement due to gravity acceleration
         this.dy += this.dy * 0.02;
         // draw called each time it updates, so it reappears
         this.draw();
      };

      // redraw line starting at 0
      this.redraw = function() {
         this.y = y;
         this.dy = dy;
         // set raindrop to iniital value now it resets
         this.raindropColour = rainColour;
         this.update();
      };

      // triggering splash function when raindrop hits floor
      this.splash = function() {
         // make raindrop invisible while its on the 'floor'
         this.raindropColour = 'transparent';
         // splash to the left...
         paintbrush.beginPath();
         paintbrush.arc(this.x-this.splashRadius, canvasHeight, this.splashRadius, Math.PI*this.splashStartLeft, Math.PI*this.splashEndLeft);
         paintbrush.strokeStyle = this.splashColour;
         paintbrush.stroke();
         // ... splash to the right
         paintbrush.beginPath();
         paintbrush.arc(this.x+this.splashRadius, canvasHeight, this.splashRadius, Math.PI*this.splashStartRight, Math.PI*this.splashEndRight);
         paintbrush.strokeStyle = this.splashColour;
         paintbrush.stroke();
         // increase splash distance with each loop, going by splash speed intervals
         this.splashStartLeft -= this.splashSpeed;
         this.splashEndLeft -= this.splashSpeed;
         this.splashStartRight += this.splashSpeed;
         this.splashEndRight += this.splashSpeed;

         if (this.splashStartRight >= 2) {
            // to reset rain motion, and restart whole drawing
            this.splashStartLeft = splashStartLeft;
            this.splashEndLeft = splashEndLeft;
            this.splashStartRight = splashStartRight;
            this.splashEndRight = splashEndRight;
            this.y = 0;
            this.redraw();
         }
      };
   }



   // array of items
   var shapeArray = [];
   for (var i = 0; i < rainAmount; i++) {
      // get randomised numbers
      var length = 30;
      // start point (randomised), y starts above screen at a random height multiplied by canvas height
      var x = Math.random() * canvasWidth;
      var y = 0 - length - (Math.random() * canvasHeight);
      // x velocity (randomised)
      var randVelocity = getRandom(1, 6);
      // max splash radius
      var splashRadius = getRandom(10, 20);
      shapeArray.push(new shapeGenerate(x, y, randVelocity, length, splashRadius, '#fff'));
   }


   // animation loop, keeps on goin and goin
   function animate() {
      requestAnimationFrame(animate);
      // clear canvas after every frame
      paintbrush.clearRect(0,0,canvasWidth,canvasHeight);
      for (var i = 0; i < shapeArray.length; i++) {
         shapeArray[i].update();
      }
   }

   animate();

}
