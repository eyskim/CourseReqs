/** @jsxRuntime classic */
/** @jsx jsx */
import { FC, useEffect, useState } from "react"
import { jsx } from "theme-ui"
import * as go from "gojs"
import { ReactDiagram } from "gojs-react"
import "../../utils/course_map/HyperlinkText"

const CourseMap: FC<{ nodes?: any }> = ({ nodes }) => {
  const [legend, setLegend] = useState(new go.Node())
  const [diagram, setDiagram] = useState(new go.Diagram())

  useEffect(() => {
    document.getElementById("remove-instructions").addEventListener("click", function() {
      diagram.remove(legend)
    })

    document.getElementById("zoom-to-fit").addEventListener("click", function() {
      diagram.commandHandler.zoomToFit()
    })

    document.getElementById("center-root").addEventListener("click", function() {
      diagram.scale = 1
      diagram.commandHandler.scrollToPart(diagram.findNodeForKey(1))
    })

    document.getElementById("collapse-all").addEventListener("click", function() {
      diagram.nodes.each(function(n) {
        n.wasTreeExpanded = false
        n.collapseTree()
      })
      diagram.commandHandler.collapseTree(diagram.findNodeForKey(1))
      diagram.commandHandler.zoomToFit()
    })
    
    document.getElementById("expand-all").addEventListener("click", function() {
      diagram.nodes.each(function(n) { n.wasTreeExpanded = true })
      diagram.findTreeRoots().each(function(n) { n.expandTree() })
      diagram.commandHandler.zoomToFit()
    })
  }, [legend, diagram])
  
  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make
  
    const diagram = $(go.Diagram,
      { 
        "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
        "animationManager.isEnabled": false,
        initialAutoScale: go.Diagram.Uniform,
        initialDocumentSpot: go.Spot.Left,
        initialViewportSpot: go.Spot.Left
      },
      {
        layout: $(
          go.TreeLayout,
          { 
            angle: 0, 
            layerSpacing: 50
          }
        )
      })
  
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { isTreeExpanded: false },
        $(go.Shape,
          new go.Binding("height", "height"),
          new go.Binding("figure", "figure"),
          new go.Binding("strokeWidth", "strokeWidth"),
          new go.Binding("fill", "color"),
          new go.Binding("stroke", "strokeColor")),
        $("TreeExpanderButton",
          {
            "_treeExpandedFigure": "TriangleRight",
            "_treeCollapsedFigure": "TriangleLeft",
            "ButtonIcon.fill": "rgb(95, 82, 122)",
            "ButtonIcon.strokeWidth": 2,
            "ButtonBorder.figure": "Circle",
            "ButtonBorder.opacity": 0.0,
            "_buttonStrokeOver": "rgb(95, 82, 122)"
          },
          { 
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Top
          },
          { visible: true }),
        $("HyperlinkText",
          function(node) { return node.data.url },
          function(node) { return node.data.nodeName },
          { 
            margin: 5,
            textAlign: "center"
          },
          new go.Binding("font", "font"),
          new go.Binding("stroke", "strokeColor")),
        {
          toolTip:
            $("ToolTip",
              new go.Binding("visible", "visible"),
              $(go.TextBlock,
                { 
                  margin: 4,
                  font: "bold 10pt sans-serif"
                },
                new go.Binding("text", "title")))})
  
    diagram.nodeTemplate.contextMenu = 
      $("ContextMenu",
        $("ContextMenuButton",
          $(go.Shape, 
            {
              fill: "rgb(240, 245, 250)",
              height: 24,
              width: 120,
              stroke: "rgb(240, 245, 250)"
            }),
          $(go.TextBlock, 
            {
              text: "Remove Course",
              font: "bold 15px sans-serif",
              stroke: "rgb(95, 82, 122)"
            }),
          {
            click: (e, obj: any) => {
              let node = obj.part.adornedPart
              if (node !== null) {
                diagram.startTransaction("remove course")
                diagram.removeParts(node.findTreeParts())
                diagram.commitTransaction("remove course")
              }
            }
          }))
    
    diagram.linkTemplate = 
      $(go.Link,
        { routing: go.Link.Orthogonal,  // Orthogonal routing
          corner: 10 },
        $(go.Shape,
          { 
            strokeWidth: 3,
            stroke: "rgb(240, 245, 250)"
          }),
        $(go.Shape,
          { 
            fromArrow: "Backward",
            strokeWidth: 5,
            stroke: "rgb(240, 245, 250)"
          }))
  
    diagram.model = new go.TreeModel()
  
    const legend = 
      $(go.Node, "Auto",
        $(go.Shape,
          { 
            figure: "Rectangle",
            width: 280,
            height: 225,
            fill: "rgb(34, 38, 57)",
            stroke: "rgb(95, 82, 122)",
            strokeWidth: 6,
          }),
        $(go.TextBlock, 
          { 
            text: "Right click on or hold down node +\n\
                    click 'Remove Course' to remove course.\n\n\
                    Click on a course node to open its\n\
                    course reqs page.\n\n\
                    'Ctrl + Z' to Undo or 'Ctrl + Y' to Redo.\n\n\
                    Course Reqs is NOT a substitute for\n\
                    academic advising. Not all information\n\
                    is 100% correct or up-to-date.\n\
                    Should double-check all information\n\
                    on the official course calendar.",
            font: "italic bold 10pt sans-serif",
            stroke: "rgb(240, 245, 250)",
            margin: 0
          }))
    diagram.add(legend)
    
    diagram.addDiagramListener("InitialLayoutCompleted", (e) => {
      e.diagram.findTreeRoots().each(function(r) { r.expandTree(3) })
    })

    setDiagram(diagram)
    setLegend(legend)

    return diagram
  }

  return (
      <div className="course-map">
        <div sx={{ variant: "containers.courseMap.buttonContainer" }}>
          {/* Using an iterator to create each button results in error 
          because of each getElementById(<button-id>) */}
          <button 
            id="remove-instructions" 
            sx={{ variant: "containers.courseInfo.button" }}
          >
            Remove Instructions
          </button>
          <button 
            id="zoom-to-fit" 
            sx={{ variant: "containers.courseInfo.button" }}
          >
            Zoom to Fit
          </button>
          <button 
            id="center-root" 
            sx={{ variant: "containers.courseInfo.button" }}
          >
            Center on Root
          </button>
          <button 
            id="collapse-all" 
            sx={{ variant: "containers.courseInfo.button" }}
          >
            Collapse All
          </button>
          <button 
            id="expand-all"
            sx={{ variant: "containers.courseInfo.button" }}
          >
            Expand All
          </button>
        </div>
        <ReactDiagram
          divClassName='course-map-canvas'
          initDiagram={initDiagram}
          nodeDataArray={nodes}
          onModelChange={() => {}}
        />
      </div>
  ) 
}

export default CourseMap
