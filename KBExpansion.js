// Get the active comp
var comp = app.project.activeItem;

if (!comp || !(comp instanceof CompItem)) {
    alert("Please select a composition first.");
} else if (comp.selectedLayers.length === 0) {
    alert("Please select a main layer before running the script.");
} else {
    var mainLayer = comp.selectedLayers[0];

    // Build a small UI to choose orientation
    var dialog = new Window("dialog", "Choose Expansion");
    dialog.orientation = "column";
    
    var panel = dialog.add("panel");
    panel.orientation = "column";
    panel.alignment = "fill";
    panel.margins = 10;
    
    var titleText = panel.add("statictext", undefined, "Expansion Direction");
    titleText.alignment = "center";
    
    var btnVertical = panel.add("button", undefined, "Vertical");
    var btnHorizontal = panel.add("button", undefined, "Horizontal");
    

    // Add the credits text
    var info = dialog.add("statictext", undefined, "Created by Koray Birand");
    // Adjust the font size (example: 10)
    info.graphics.font = ScriptUI.newFont(info.graphics.font.name, ScriptUI.FontStyle.REGULAR, 10);

    btnVertical.onClick = function() {
        dialog.close(1);
    };
    btnHorizontal.onClick = function() {
        dialog.close(2);
    };

    var choice = dialog.show();

// If user chose Vertical
if (choice === 1) {
    app.beginUndoGroup("Setup Vertical");

    // Create Controller Null
    var controller = comp.layers.addNull();
    controller.name = "Controller Vertical";
    controller.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([50,50]);
    // Add Expression Controls
    var cropEffect = controller.Effects.addProperty("ADBE Slider Control");
    cropEffect.name = "Crop";
    var slideEffect = controller.Effects.addProperty("ADBE Slider Control");
    slideEffect.name = "Slide";
    var stretchEffect = controller.Effects.addProperty("ADBE Slider Control");
    stretchEffect.name = "Stretch";
    stretchEffect.property("ADBE Slider Control-0001").setValue(100);
    var brightEffect = controller.Effects.addProperty("ADBE Slider Control");
    brightEffect.name = "Brightness";

    // Duplicate main layer as Stretch Layer
    var stretchLayer = mainLayer.duplicate();
    stretchLayer.name = "Stretch Layer";

    // Arrange layer order:
    // 1 - Controller Vertical
    // 2 - Stretch Layer
    // 3 - Main Video Layer
    controller.moveToBeginning();
    stretchLayer.moveAfter(controller);
    mainLayer.moveAfter(stretchLayer);

    // Add expression to Main Video Layer position
    mainLayer.property("Position").expression = 
        "var y = thisLayer.source.height / 2 + thisComp.layer(\"Controller Vertical\").effect(\"Slide\")(\"Slider\");\n" +
        "[transform.position[0],y]";

    // Add expression to Stretch Layer Mask path shape
    // Ensure a mask is present
    var mask = stretchLayer.Masks.addProperty("Mask");
    mask.maskMode = MaskMode.ADD;
    var maskShape = mask.property("ADBE Mask Shape");
    maskShape.expression =
        "var myH = thisComp.layer(thisComp.numLayers).source.height / 2;\n" +
        "var myA = thisComp.layer(thisComp.numLayers).source.height;\n" +
        "var pos = thisComp.layer(thisComp.numLayers).position[1];\n" +
        "if (pos > myH) {\n" +
        "    var side = \"Top\";\n" +
        "} else {\n" +
        "    var side = \"Down\";\n" +
        "}\n" +
        "var w = thisLayer.source.width;\n" +
        "var h = thisLayer.source.height;\n" +
        "var initX = thisComp.layer(\"Controller Vertical\").effect(\"Crop\")(\"Slider\");\n" +
        "var maskHeight = (initX)\n" +
        "if (side == \"Top\") {\n" +
        "    createPath([\n" +
        "        [0, 0],\n" +
        "        [w, 0],\n" +
        "        [w, initX],\n" +
        "        [0, initX]\n" +
        "    ], [], [], true);\n" +
        "} else {\n" +
        "    var topLeft = myA - initX;\n" +
        "    createPath([\n" +
        "        [0, topLeft],\n" +
        "        [w, topLeft],\n" +
        "        [w, myA],\n" +
        "        [0, myA]\n" +
        "    ], [], [], true);\n" +
        "}";

    // Add expression to Stretch Layer Position
    stretchLayer.property("Position").expression =
    "var myW = thisComp.layer(thisComp.numLayers).source.height / 2;\n" +
    "var myA = thisComp.layer(thisComp.numLayers).source.height;\n" +
    "var pos = thisComp.layer(thisComp.numLayers).position[1];\n" +
    "var crop = thisComp.layer(\"Controller Vertical\").effect(\"Crop\")(\"Slider\");\n" +
    "var pan = thisComp.layer(thisComp.numLayers).position[1];\n" +
    "var w = thisComp.layer(thisComp.numLayers).source.height /2 ;\n" +
    "if (pos > myW) {\n" +
    "    var slide = pan - myW;\n" +
    "    var x = transform.position[0];\n" +
    "    var y = crop + slide;\n" +
    "    [x,y]\n" +
    "} else {\n" +
    "    var x = transform.position[0];\n" +
    "    var slide = myA - crop - (w - pan);\n" +
    "    var y = slide;\n" +
    "    [x,y]\n" +
    "}";



    // Add expression to Stretch Layer Anchor Point
    stretchLayer.property("Anchor Point").expression =
    "var myH = thisComp.layer(thisComp.numLayers).source.height / 2;\n" +
    "var myHA = thisComp.layer(thisComp.numLayers).source.height;\n" +
    "var myWidth = thisComp.layer(thisComp.numLayers).source.width /2;\n" +
    "var pos = thisComp.layer(thisComp.numLayers).position[1];\n" +
    "\n" +
    "var x = thisComp.layer(\"Controller Vertical\").effect(\"Crop\")(\"Slider\");\n" +
    "var w = thisComp.layer(thisComp.numLayers).source.height;\n" +
    "var slide = pos - x;\n" +
    "var aaa = myH - slide;\n" +
    "if (pos > myH) {\n" +
    "    var xx = pos -w;\n" +
    "    var y = transform.anchorPoint[0];\n" +
    "    [y,x]\n" +
    "} else {\n" +
    "    var y = myHA - x;\n" +
    "    [myWidth,y]\n" +
    "}";

    // Add expression to Stretch Layer Scale
    stretchLayer.property("Scale").expression =
        "[transform.scale[0],thisComp.layer(\"Controller Vertical\").effect(\"Stretch\")(\"Slider\")]";

    // Add Brightness & Contrast effect to Stretch Layer and link Brightness
    var brightnessEffect = stretchLayer.Effects.addProperty("ADBE Brightness & Contrast");
    brightnessEffect.property("ADBE Brightness & Contrast-0001").expression =
        "thisComp.layer(\"Controller Vertical\").effect(\"Brightness\")(\"Slider\")";


    var wt = comp.width;
    var ht = comp.height;
    comp.addGuide(1, wt/2); // Vertical guide
    comp.addGuide(1, wt/4); // Horizontal guide
    comp.addGuide(1, wt/4*3); // Horizontal guide
    
    comp.addGuide(0, ht/2); // Horizontal guide
    comp.addGuide(0, ht/4); // Horizontal guide
    comp.addGuide(0, ht/4*3); // Horizontal guide

    app.endUndoGroup();
}

if (choice === 2) {
    app.beginUndoGroup("Setup Horizontal");

    // Create Controller Null
    var controller = comp.layers.addNull();
    controller.name = "Controller Horizontal";
    controller.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([50,50]);

    // Add Expression Controls
    var cropEffect = controller.Effects.addProperty("ADBE Slider Control");
    cropEffect.name = "Crop";
    var slideEffect = controller.Effects.addProperty("ADBE Slider Control");
    slideEffect.name = "Slide";
    var stretchEffect = controller.Effects.addProperty("ADBE Slider Control");
    stretchEffect.name = "Stretch";
    stretchEffect.property("ADBE Slider Control-0001").setValue(100);
    var brightEffect = controller.Effects.addProperty("ADBE Slider Control");
    brightEffect.name = "Brightness";

    // Duplicate main layer as Stretch Layer
    var stretchLayer = mainLayer.duplicate();
    stretchLayer.name = "Stretch Layer";

    // Arrange layer order:
    controller.moveToBeginning();
    stretchLayer.moveAfter(controller);
    mainLayer.moveAfter(stretchLayer);

    // Main Video Layer Position Expression
    mainLayer.property("Position").expression = 
        "var x = thisLayer.source.width / 2 + thisComp.layer(\"Controller Horizontal\").effect(\"Slide\")(\"Slider\");\n" +
        "[x, transform.position[1]]";

    // Stretch Layer Mask
    var mask = stretchLayer.Masks.addProperty("Mask");
    mask.maskMode = MaskMode.ADD;
    var maskShape = mask.property("ADBE Mask Shape");
    maskShape.expression =
        "var myW = thisComp.layer(thisComp.numLayers).source.width / 2;\n" +
        "var pos = thisComp.layer(thisComp.numLayers).position[0];\n" +
        "if (pos > myW) {\n" +
        "  var side = \"left\";\n" +
        "} else {\n" +
        "  var side = \"right\";\n" +
        "}\n" +
        "var w = thisLayer.source.width;\n" +
        "var h = thisLayer.source.height;\n" +
        "var initX = thisComp.layer(\"Controller Horizontal\").effect(\"Crop\")(\"Slider\");\n" +
        "var maskWidth = initX;\n" +
        "var leftX, rightX;\n" +
        "if (side == \"right\") {\n" +
        "  leftX = w - maskWidth;\n" +
        "  rightX = w;\n" +
        "} else {\n" +
        "  leftX = 0;\n" +
        "  rightX = maskWidth;\n" +
        "}\n" +
        "createPath(\n" +
        "  [[leftX, 0],[rightX, 0],[rightX, h],[leftX, h]],[],[],true\n" +
        ");";

    // Stretch Layer Position
    stretchLayer.property("Position").expression =
        "var pos = thisComp.layer(thisComp.numLayers).position[0];\n" +
        "var x = thisComp.layer(\"Controller Horizontal\").effect(\"Crop\")(\"Slider\");\n" +
        "var pan = thisComp.layer(thisComp.numLayers).position[0];\n" +
        "var w = thisComp.layer(thisComp.numLayers).source.width /2;\n" +
        "if (pos > w) {\n" +
        "  var xx = pan - w;\n" +
        "  var y = transform.position[1];\n" +
        "  [x+xx,y]\n" +
        "} else {\n" +
        "  var maskPath = thisLayer.mask(\"Mask 1\").maskPath;\n" +
        "  var xx = maskPath.points();\n" +
        "  var xxx = xx[0][0];\n" +
        "  var posx = w - pan;\n" +
        "  var y = transform.anchorPoint[1];\n" +
        "  [xxx-posx,y]\n" +
        "}";

    // Stretch Layer Anchor Point
    stretchLayer.property("Anchor Point").expression =
        "var pos = thisComp.layer(thisComp.numLayers).position[0];\n" +
        "var x = thisComp.layer(\"Controller Horizontal\").effect(\"Crop\")(\"Slider\");\n" +
        "var pan = thisComp.layer(thisComp.numLayers).position[0];\n" +
        "var w = thisComp.layer(thisComp.numLayers).source.width;\n" +
        "if (pos > w/2) {\n" +
        "  var xx = pan - w;\n" +
        "  var y = transform.anchorPoint[1];\n" +
        "  [x,y]\n" +
        "} else {\n" +
        "  var maskPath = thisLayer.mask(\"Mask 1\").maskPath;\n" +
        "  var xx = maskPath.points();\n" +
        "  var xxx = xx[0][0];\n" +
        "  var y = transform.anchorPoint[1];\n" +
        "  [xxx,y]\n" +
        "}";

    // Stretch Layer Scale
    stretchLayer.property("Scale").expression =
        "[thisComp.layer(\"Controller Horizontal\").effect(\"Stretch\")(\"Slider\"), transform.scale[1]]";

    // Brightness & Contrast
    var brightnessEffect = stretchLayer.Effects.addProperty("ADBE Brightness & Contrast");
    brightnessEffect.property("ADBE Brightness & Contrast-0001").expression =
        "thisComp.layer(\"Controller Horizontal\").effect(\"Brightness\")(\"Slider\")";

    // Add guides here
    var wt = comp.width;
    var ht = comp.height;
    comp.addGuide(1, wt/2); // Vertical guide
    comp.addGuide(1, wt/4); // Horizontal guide
    comp.addGuide(1, wt/4*3); // Horizontal guide
    
    comp.addGuide(0, ht/2); // Horizontal guide
    comp.addGuide(0, ht/4); // Horizontal guide
    comp.addGuide(0, ht/4*3); // Horizontal guide

    app.endUndoGroup();
}
}