# Canvas Drawing

For drawing on canvas we have different functions

All these functions are located on: [Editor](../boardcollab/src/components/Editor.vue)


## function startDrawing(e: MouseEvent)
Gets the mouse events from drawing, detects if the drawings are being made and sends this information to the sockets as an even with the room id and the event type start.

## function stopDrawing(e: MouseEvent)
Gets the drawing events in this case when called event type is set to false with appropiate room id , getting the path of the context.  

function draw(e: MouseEvent) {
This is the main function for drawing, is the graphical component that creates the pixel on the canvas, for this it needs the Position of the mouse on the canvas,  this is calculated by , mouse relative position minus ClientRect that obtained the relative position to the viewport

```
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
```

Then the with, type and stroke of the drawing are obtained and set up on the context,

After that with the coordinates the line is created from a starting point to an ending, point, this based on coordinates,

After that a DrawEvent is sent to coordinate the drawing with the other clients opened with the specify room

## function createEvent(e: MouseEvent, type: DrawingEvent
DTO that seets the properties of the drawing event

## function clearCanvas()
    Cleans the canvas specifying the starting and ending point to clean from 0 on x,y to full canvas length and witdth


## function handleRemoteDraw(event: DrawingEvent) {

    Coordinates with the other clients the drawing of others, this event gets send to the backend to distribute with other clients, A DrawingEvent is needed to do this.



## onMounted()

    Prepares the canvas context and sets the function to handle the remote drawing