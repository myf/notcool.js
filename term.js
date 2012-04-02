function terminal_setup(server_address) {
    var socket = io.connect(server_address);
    var el = document.getElementById("term");
    var ctx = el.getContext('2d');
    var xcur_init = 20;
    var ycur_init = 20;
    xcur = xcur_init;
    ycur = ycur_init;
    grace = 5;
    xbound = 20;

    var font = 11;
    var head = '~>';
            //creating head
       function fillhead(head) {
            xcur = xcur_init;
           ctx.font = "11pt Monospace";
           ctx.fillStyle = 'Grey';
           ctx.fillText(head,xcur,ycur,40);
           xcur = xcur+font*head.length;  
       }
       function easter() {

                    ctx.font = "71pt Monospace";
                    ctx.fillStyle = 'Red';
                    ctx.fillText('hackerschool',xcur_init,ycur+71,400);
                    ycur = ycur+71;
                    //ctx.font = "11pt Monospace";
                    //ctx.fillStyle = 'Green';
        }
        function redraw(){
            xcur= xcur_init;
            ycur= ycur_init;
            ctx.clearRect(0,0,el.width,el.height);
            fillhead(head);

        }
        
        
       fillhead(head);
        //press key
        //key events
       var command = new Array();
       var pos = new Array();
       
       el.onkeypress = function(evt) {
           var charCode = evt.which;
           var charStr = String.fromCharCode(charCode);
           ctx.font = "11pt Monospace";
           ctx.fillStyle = 'Green';
           //actuall fill
           command.push(charStr);
           pos.push(new Array(xcur, ycur));
           ctx.fillText(charStr,xcur,ycur,100);
           xcur = xcur+font;
           //wrap
           if (xcur>=el.width-xbound){
                ycur=ycur+font+grace;
                xcur=xcur_init;
            }
           if(ycur>=el.height-xbound){
                redraw();
                

            }
           //when enter key pressed
           if (charCode == 13){
                command.splice(command.length-1);
               //alert(command.join(''));
               var data=command.join('');
                if (data =='hackerschool'){
                    easter();
                }else   
                if (data =='clear'){
                    redraw();
                    command = new Array();
                    pos = new Array();
                    return;
                }else
                if (data==="identify myf"){
                    //head = 'myf '+head;
                }else{
               socket.emit('request',data);
                }
                           
                command = new Array();
                pos = new Array();
                ycur = ycur+font+grace;
                //fillhead(head);
                return;
            }
           
       };
       //backspace magic
       el.onkeydown = function(evt) {
           var charCode = evt.which;
           var charStr = String.fromCharCode(charCode);
           if (charCode === 8) {
                command.splice(command.length-1);
                prev = pos.pop();
                xcur = prev[0]; 
                ycur = prev[1]; 
                ctx.clearRect(xcur,ycur-font,font, font+grace);

           }
       };
     

        socket.on('response', function(output){
           ctx.font = "11pt Monospace";
           ctx.fillStyle = 'Green';
                    for (i=0;i<output.length;i++) {
                    xcur = xcur_init;
                    ycur = ycur+font+grace;
                    //TODO: count the length of the string on screen, and separate them into lines. WRAPPING

                    ctx.fillText(output[i],xcur,ycur);
                    }
            
            command = new Array();
            pos = new Array();
            fillhead(head);
            return;
        });

}
