System.register(["./p-43d2bece.system.js","./p-5b2240d7.system.js"],(function(e){"use strict";var t,r;return{setters:[function(e){t=e.c},function(e){r=e.createGesture}],execute:function(){var a=e("createSwipeBackGesture",(function(e,a,n,i,s){var v=e.ownerDocument.defaultView;var c=function(e){return e.startX<=50&&a()};var u=function(e){var t=e.deltaX;var r=t/v.innerWidth;i(r)};var o=function(e){var r=e.deltaX;var a=v.innerWidth;var n=r/a;var i=e.velocityX;var c=a/2;var u=i>=0&&(i>.2||e.deltaX>c);var o=u?1-n:n;var d=o*a;var f=0;if(d>5){var l=d/Math.abs(i);f=Math.min(l,540)}s(u,n<=0?.01:t(0,n,.9999),f)};return r({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:c,onStart:n,onMove:u,onEnd:o})}))}}}));