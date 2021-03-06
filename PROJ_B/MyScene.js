/**
* MyScene
* @constructor
*/


//GLOBAL VARIABLES
var DTR = Math.PI / 180; //DEGREES TO RADIAN

class MyScene extends CGFscene
{
    constructor(){ super(); }
    init(application)
    {
        super.init(application);
        this.initCameras();
        this.initLights();
        this.gl.clearColor(0.0, 0.2, 0.3, 1.0); //Background color 
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);
        this.msNumber = 5; //aprox 67 FPS
        this.setUpdatePeriod(this.msNumber);
        
        
        
        // ==== Initialize scene objects ====
        this.nBranches = 5; //DISPLAYED BRANCHES
        this.bird       = new MyBird(this, 5, 5, 5);
        this.axis       = new CGFaxis(this);
        this.terrain    = new MyTerrain(this);
        this.amb        = new MyCubeMap(this);
        this.branchesVec = [];
        for (var i = 0; i < this.nBranches; i++)
        this.branchesVec.push(new MyTreeBranch(this, "images/wood.jpg", true));
        
        this.house      = new MyHouse(this, "images/oak2.jpg", "images/oak.jpg", "images/door.png", "images/window.jpg", "images/pillar2.jpg"); //textures are configurable here
        this.treegroup  = new MyTreeGroupPatch(this, 3, 60.0, 4, 0.9);
        this.nest       = new MyNest(this, "images/nest2.jpg", 25, 2.4); //make sure to use a amount of edges at least 5 times greater than the radius
        //notice that the ground of the nest is always a circle so edges of the nest should be above 10 or around that to simulate a circle (25 in our case)
        this.nestground = new MyCircle(this, 10);
        this.lightning  = new MyLightning(this);
        
        // ==== Objects connected to MyInterface
        this.enableTex = true;
        this.displayAxis = true;
        this.birdScaleF = 1.0;  //scale of the bird
        this.birdSpeedF = 1.0;  //differente from the actual speed of the bird
        this.sceneLight = 0.1;  //this may disturb viewing the axis with colors
        this.viewerPos = 0.4;   //scene scale
        
        
        // ==== Initializing Materials
        this.McubeDay = new CGFappearance(this);
        this.McubeDay.setAmbient(1, 1, 1, 1);
        this.McubeDay.setDiffuse(1, 1, 1, 1);
        this.McubeDay.setSpecular(1, 1, 1, 1);
        this.McubeDay.setShininess(10);
        this.McubeDay.loadTexture("images/cubemaptexday.png");
        this.McubeDay.setTextureWrap('REPEAT', 'REPEAT');
        
        this.nestgroundtex = new CGFappearance(this);
        this.nestgroundtex.setAmbient(1, 1, 1, 1);
        this.nestgroundtex.setDiffuse(0.4, 0.4, 0.4, 1);
        this.nestgroundtex.setSpecular(1, 1, 1, 1);
        this.nestgroundtex.setShininess(10);
        this.nestgroundtex.loadTexture("images/nest.jpg");
        this.nestgroundtex.setTextureWrap('REPEAT', 'REPEAT');
        
        // ========== END INIT
        // ========== END INIT
        // ========== END INIT
    }
    
    initLights()
    {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setAmbient(0.1, 0.1, 0.1, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();

        this.lights[1].setPosition(0, 0, 0, 1);
        this.lights[1].setAmbient(0.05, 0.05, 0.05, 1);
        this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
        this.lights[1].enable();
        this.lights[1].update();
    }

    initCameras()
    {
        this.camera = new CGFcamera(0.4, 0.1, 500,
        vec3.fromValues(45, 45, 45), vec3.fromValues(0, 0, 0));
    }

    
    setDefaultAppearance()
    {
        this.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(50.0);
    }
    


    // ==== INPUT ====

    checkKeys(t)
    {
        var text = "Keys pressed:";
        var keysPressed = false;
        // ================================
        if(this.gui.isKeyPressed("KeyW"))       //KEY TO MOVE FORWARD: W
        {
            text += " W "; keysPressed = true;
            this.bird.accelerate(0.3);
        }
        // ================================
        if (this.gui.isKeyPressed("KeyS"))      //KEY TO MOVE BACKWARDS: S
        {
            text += " S "; keysPressed = true;
            this.bird.accelerate(-0.3);
        }
        // ================================
        if (this.gui.isKeyPressed("KeyA"))      //KEY TO ROTATE LEFT: A
        {
            text += " A "; keysPressed = true;
            this.bird.turn(-15 * DTR);
        }
        // ================================
        if (this.gui.isKeyPressed("KeyD"))      //KEY TO ROTATE RIGHT: D
        {
            text += " D "; keysPressed = true;
            this.bird.turn(15 * DTR);
        }
        // ================================
        if (this.gui.isKeyPressed("KeyR"))      //KEY TO RESET BIRD: R
        {
            text += " R "; keysPressed = true;
            this.bird.resetBird();
        }
        // ================================
        if (this.gui.isKeyPressed("Digit0"))    //KEY TO STOP BIRD: SHIFT + 0 (=) or 0
        {
            text += " 5 "; keysPressed = true;
            //make the bird stand still at his current position
            //with this your able to control the bird better also (no automatic move)
            this.bird.fullStop();
        }
        if (this.gui.isKeyPressed("Digit6"))    //KEY TO temp STOP BIRD: SHIFT + 6 (&) or 6
        {
            text += " 6 "; keysPressed = true;
            this.bird.holdStill(t);
        }
        // ================================
        if (this.gui.isKeyPressed("KeyP"))      //KEY TO ATTEMP TO PICKUP BRANCH / FLY DOWN: P
        {
            text += " P "; keysPressed = true;
            if(this.bird.state == this.bird.states.casual) this.bird.flyDown();
            //if he's casually flying make him fly down (possibly picking up a branch)
        }
        //================================
        if (this.gui.isKeyPressed("KeyL"))      //KEY FOR LIGHTNING: L
        {
            text += " L "; keysPressed = true;
            this.lightning.startAnimation(t);
        }
        // ================================
        if (keysPressed) console.log(text);
    }

    update(t)
    {
        this.checkKeys(t);
        this.bird.updateBird(t);
        this.lightning.update(t);
    }
    
    catchBranch()
    {
        if (this.bird.branchPickedUp == null)
        {
            for (var i=0; i < this.nBranches; i++)
            {
                var cat_distx = (this.bird.x - this.branchesVec[i].x) * (this.bird.x - this.branchesVec[i].x);
                var cat_distz = (this.bird.z - this.branchesVec[i].z) * (this.bird.z - this.branchesVec[i].z);
                var distance = Math.sqrt(cat_distx + cat_distz);

                if (distance <= this.bird.targetRadius + this.branchesVec[i].targetRadius)
                {
                    this.bird.getBranch(this.branchesVec[i]);
                    this.branchesVec.splice(i, 1); //pop 1 counting from i, our current position
                    break;
                }
            }
        }
        
        //if he already has a branch allow him to drop it off in the nest
        else 
        {
           var cat_distx = (this.bird.x - this.nest.x) * (this.bird.x - this.nest.x)
           var cat_distz = (this.bird.z - this.nest.z) * (this.bird.z - this.nest.z)
           var distance = Math.sqrt(cat_distx + cat_distz);

           if (distance <= this.bird.targetRadius + this.nest.targetRadius)
           {
              this.nest.branchContainer.push(this.bird.branchPickedUp);
              this.bird.rmBranch();
           }
        }
    }


    //====================================
    display()
    {
        // ---- INITIAL SETUP ----
        // Clear image and depth buffer everytime we update the scene
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.updateProjectionMatrix();
        this.loadIdentity();            // Initialize Model-View matrix as identity (no transformation)
        this.applyViewMatrix();         // Apply transformations corresponding to the camera position relative to the origin
        this.setDefaultAppearance();    // Apply default appearance

        // ---- GUI managed ----
        this.setGlobalAmbientLight(this.sceneLight, this.sceneLight, this.sceneLight, 1);
        this.scale(this.viewerPos, this.viewerPos, this.viewerPos);
        this.setUpdatePeriod(this.msNumber);
        
        // ---- BEGIN Primitive drawing section =====================================================================================
        this.pushMatrix();
        this.translate(0, 5, 0);                         // VIEW AXIS MORE CLEARLY
        this.scale(2, 2, 2);                             // LARGER AXIS
        if(this.displayAxis) this.axis.display();        // DRAW AXIS
        this.popMatrix();
           
        this.pushMatrix();
        this.translate(0, 30, 0);
        this.McubeDay.apply();
        this.amb.display();                     //DISPLAY CUBE MAP (AMBIENT)
        this.popMatrix();
        
        this.pushMatrix();
        this.bird.setBirdScale(this.birdScaleF);
        this.bird.setSpeedFactor(this.birdSpeedF);
        this.bird.display();                    //DISPLAY BIRD
        this.popMatrix();
        
        this.pushMatrix();
        this.scale(c*2, c*2, c*2); //c is defined inside MyCubeMap and represents half of the side of the cube
        this.rotate(-90 * DTR, 1, 0, 0);
        this.terrain.display();                 //DISPLAY TERRAIN
        this.popMatrix();

        this.pushMatrix();
        this.translate(-17, 6.2, -8);
        this.scale(0.7, 0.7, 0.7);
        this.rotate(45*DTR, 0, 1, 0);
        this.house.display();                   //DISPLAY HOUSE
        this.popMatrix();

        this.pushMatrix();
        this.translate(15, 3.2, -3);
        this.scale(0.6, 0.6, 0.6);
        this.rotate(90*DTR, 0, 1, 0);
        this.treegroup.display();              //DISPLAY FOREST
        this.popMatrix();

        //============================================= BRANCHES
        this.pushMatrix();
        for (var i = 0; i < this.nBranches; i++)
        {
            this.pushMatrix();
            this.translate(this.branchesVec[i].x, this.branchesVec[i].y, this.branchesVec[i].z);
            this.rotate(this.branchesVec[i].rot, 0, 1, 0);
            this.branchesVec[i].display();
            this.popMatrix();
        }
        this.popMatrix();

        //=============================================
        //DISPLAYING NEST
        this.pushMatrix();
        this.translate(this.nest.x, this.nest.y, this.nest.z); //conflict with nest itself so y is -4.5...~
        this.nest.display();
        this.popMatrix();
        this.pushMatrix();
        this.translate(this.nest.x, this.nest.y, this.nest.z);
        this.scale(this.nest.r, 1, this.nest.r);
        this.rotate(-90*DTR, 1, 0, 0);
        this.nestgroundtex.apply();             //NEST GROUND (CIRCLE) 
        this.nestground.display();              //DISPLAY NEST
        this.popMatrix();



        this.pushMatrix();

        if (this.lightning.lightningOn()){
            this.translate(0, 70.0, 0);
            this.scale(10, 10, 10);
            this.lightning.display();              //DISPLAY LIGHTNING
        }

        this.popMatrix();
        
        // ---- END Primitive drawing section =====================================================================================
        if (this.enableTex) this.enableTextures(true);
        else this.enableTextures(false);
    }

}
