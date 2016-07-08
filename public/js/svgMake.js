/** 
 * This file contains functions for creating new SVG objects.
 * 
 * You must implement the required functions. 
 * 
 * You are encouraged to implement more helper functions here if you need to. 
 * 
 * You may find a tutorial on SVG at: http://www.w3schools.com/svg/ 
 */ 

//  Namespace for SVG elements, different than normal HTML element namespace.
var SVGNameSpace = "http://www.w3.org/2000/svg";

/**
* Makes and returns a new SVG rectange object. 
* 
* @param x {number} the x position of the rectangle.
* @param y {number} the y position of the rectangle.
* @param w {number} the width of the rectangle.
* @param h {number} the height of the rectangle.
* 
* @return {object} 
*/ 
function makeClick(x, y, w, h, dataX, dataY){
   var click = document.createElementNS(SVGNameSpace, "rect"); 

   // Checkout docs at: http://www.w3schools.com/svg/svg_rect.asp
   click.setAttribute("onclick", 'alert("rip u Justin")');
   click.setAttribute("onmouseover", 'setAttribute("fill-opacity", 0.5)');
   click.setAttribute("onmouseout", 'setAttribute("fill-opacity", 0)');
   click.setAttribute("width", w);
   click.setAttribute("height", w);
   click.setAttribute("x", x);
   click.setAttribute("y", y);
   click.setAttribute("fill", "grey");
   click.setAttribute("fill-opacity", 0);
   click.setAttribute("data-x", dataX);
   click.setAttribute("data-y", dataY);
   click.setAttribute("class", "click");
   
   return click; 
}

function indicate(cls){
	cls.setAttribute("fill-opacity", .5);
}

/**
* Makes and returns a new SVG rectange object. 
* 
* @param x {number} the x position of the rectangle.
* @param y {number} the y position of the rectangle.
* @param w {number} the width of the rectangle.
* @param h {number} the height of the rectangle.
* @param c {string} the color of the rectangle. 
* 
* @return {object} 
*/ 
function makeRectangle(x, y, w, h, c){
   var rect = document.createElementNS(SVGNameSpace, "rect"); 

   // Checkout docs at: http://www.w3schools.com/svg/svg_rect.asp
   rect.setAttribute("width", w);
   rect.setAttribute("height", w);
   rect.setAttribute("x", x);
   rect.setAttribute("y", y);
   rect.setAttribute("class", c);
   
   return rect; 
}

/**
* Makes and returns a new SVG circle object. 
* 
* @param x {number} the x position of the circle.
* @param y {number} the y position of the circle.
* @param r {number} the radius 
* @param c {number} the color 
* 
* @return {object} 
*/
function makeCircle(x, y, r, c){

   var circ = document.createElementNS(SVGNameSpace, "circle"); 

    // Checkout docs at: http://www.w3schools.com/svg/svg_circle.asp
    circ.setAttribute("cx", x);
    circ.setAttribute("cy", y);
    circ.setAttribute("r", r);
    circ.setAttribute("class", c);
    circ.setAttribute("stroke", "black");

   return circ;

}

/**
* Makes an SVG element. 
* 
* @param w {number} the width
* @param h {number} the height 
* 
* @return {object} 
*/
function makeSVG(w, h){
    var s = document.createElementNS(SVGNameSpace, "svg"); 
    s.setAttribute("width", w); 
    s.setAttribute("height", w); 
    s.setAttribute('xmlns', SVGNameSpace);
    s.setAttribute('xmlns:xlink',"http://www.w3.org/1999/xlink");
    return s;
}
