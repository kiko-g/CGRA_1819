/**
* MyInterface
* @constructor
*/
class MyInterface extends CGFinterface
{
    constructor() { super(); }
    init(application) 
    {
        // call CGFinterface init
        super.init(application);
        // init GUI. For more information on the methods, check:
        // http://workshop.chromeexperiments.com/examples/gui
        this.gui = new dat.GUI();
        var obj = this; //obj

        //Checkbox elements in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene.tangram, 'displayGreen').name('Green');
        this.gui.add(this.scene.tangram, 'displayYellow').name('Yellow');
        this.gui.add(this.scene.tangram, 'displayOrange').name('Orange');
        this.gui.add(this.scene.tangram, 'displayPurple').name('Purple');
        this.gui.add(this.scene.tangram, 'displayRed').name('Red');
        this.gui.add(this.scene.tangram, 'displayBlue').name('Blue');
        this.gui.add(this.scene.tangram, 'displayPink').name('Pink');
        this.gui.add(this.scene, 'displayTangram').name('TANGRAM');
        this.gui.add(this.scene, 'displayUnitCube').name('CUBE');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 3).name('Scale Factor');

        return true;
    }
}