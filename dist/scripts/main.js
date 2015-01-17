var cmu={colorObj:null,color:null,colors:["#27bdbe","#2bd2a3","#5c4561","#d5408b","#f05350","#4F86C6","#E8871E","#4C2719","#F8FA90","#ff0044"],types:["h","s","l"],orders:["asc","desc"],init:function(){this.setOptions(),this.$app=$(".app"),this.$chooser=$(".app__chooser"),this.$input=this.$chooser.find("input"),this.setEvents(),this.setStates(),this.setColor(),this.buildColors()},setOptions:function(){var s=_.extend({type:"h",order:"desc",color:""},this.hash);this.color=s.color&&this.validHex(s.color)?"#"+s.color:this.colors[Math.floor(Math.random()*this.colors.length)],this.type=this.types.indexOf(s.type)>-1?s.type:"h",this.order=this.orders.indexOf(s.order)>-1?s.order:"desc"},setStates:function(){this.$input.val(this.color.replace("#","")),this.$app.find(".app__type [data-type="+this.type+"]").addClass("active")},setColor:function(){return console.log("setColor",this.color),this.colorObj=new Color(this.color),this.isInt(this.colorObj.rgb.r)&&this.isInt(this.colorObj.rgb.g)&&this.isInt(this.colorObj.rgb.b)?(this.$chooser.css({backgroundColor:this.color,borderColor:this.darken(15)}),this.$chooser.find("h1").css({color:this.changeLightness(this.colorObj.lightness()<=50?70:20)}),this.$chooser.find("input").css({backgroundColor:this.lighten(90-+this.colorObj.lightness()),borderColor:this.darken(15)}),void this.buildBoxes()):(this.$app.find(".app__message").html("Not a valid color"),!1)},buildColors:function(){var s=[];_.each(this.colors,function(o){s.push('<a href="#" data-color="'+o.replace("#","")+'" style="background-color: '+o+'"></a>')}),this.$app.find(".app__palette").html(s.join(""))},buildBoxes:function(s){for(var o,t,h=_.extend({max:"h"===this.type?356:96,factor:4,h:"changeHue",s:"changeSaturation",l:"changeLightness"},s),e="h"===this.type?cmu.colorObj.hue():"desc"===this.order?h.max:0,i=[];"desc"===this.order?e>0:e<=h.max;)o=this[h[this.type]](e),t=new Color(o),console.log(t.hex,t.hsl.l),t=t.hsl2hex({h:t.hsl.h,s:0,l:+t.hsl.l+40>100?Math.abs(40-+t.hsl.l):+t.hsl.l+40}),i.push('<div style="background-color: '+o+'"><div class="box__hex" style="color: '+t+';">'+o+"</div></div>"),e="desc"===this.order?e-h.factor:e+h.factor;if(console.log("buildBoxes:afterloop",this.order,e,cmu.colorObj.hue()),"h"===this.type){for(e="asc"===this.order?0:360;"desc"===this.order?e>cmu.colorObj.hue():e<=cmu.colorObj.hue();)o=this[h[this.type]](e),t=new Color(o),t=t.hsl2hex({h:t.hsl.h,s:0,l:+t.hsl.l+40>100?Math.abs(40-+t.hsl.l):+t.hsl.l+40}),i.push('<div style="background-color: '+o+'"><div class="box__hex" style="color: '+t+';">'+o+"</div></div>"),e="desc"===this.order?e-h.factor:e+h.factor;console.log("buildBoxes hue loop again",cmu.colorObj.hue(),e)}this.$app.find(".app__boxes").html("").append(i)},changeLightness:function(s){return this.colorObj.hsl2hex({h:this.colorObj.hsl.h,s:this.colorObj.hsl.s,l:s})},changeSaturation:function(s){return this.colorObj.hsl2hex({h:this.colorObj.hsl.h,s:s,l:this.colorObj.hsl.l})},changeHue:function(s){return this.colorObj.hsl2hex({h:s,s:this.colorObj.hsl.s,l:this.colorObj.hsl.l})},lighten:function(s){return Transforms.lighten(this.colorObj,s)},darken:function(s){return Transforms.darken(this.colorObj,s)},isInt:function(s){var o=/^-?[0-9]+$/;return o.test(s)},validHex:function(s){return s.match(new RegExp("[0-9A-Fa-f]","g"))},getHash:function(){console.log("getHash",this.hash,this.color),this.hash=_.extend(this.hash,deparam(location.hash.replace("#",""))),this.setOptions(),this.setStates(),this.buildBoxes()},setHash:function(){var s={color:this.color.replace("#",""),type:this.type};"desc"!==this.order&&(s.order=this.order),this.hash=_.extend(this.hash,s),location.hash=$.param(this.hash)},setEvents:function(){$(document).on("click",".app__palette a",function(s){s.preventDefault();var o=$(s.currentTarget);this.$input.val(o.data("color")),this.color="#"+o.data("color"),this.setHash(),this.setColor()}.bind(this)).on("click",".app__type a",function(s){s.preventDefault();var o=$(s.currentTarget);console.log(".app__type a:click",o),this.type=o.data("type"),o.addClass("active").siblings().removeClass("active"),this.setHash(),this.buildBoxes()}.bind(this)).on("keyup change",".app__chooser input",function(s){var o=$(s.target);if(console.log(s.keyCode,s.metaKey),[91,37,39].indexOf(s.keyCode)>-1)return!1;var t=this.validHex(o.val().replace("#","").substring(0,6));console.log("on:keyup",t);var h=t?t.join(""):"";o.val(h),6===h.length&&(this.color="#"+h,this.setHash(),this.setColor())}.bind(this))}};$(function(){cmu.hash=deparam(location.hash.replace("#","")),cmu.init()});