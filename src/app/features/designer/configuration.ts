export const TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">

  <bpmn:process
    id="Process_1"
    isExecutable="false">

    <bpmn:startEvent
      id="StartEvent_1"
      name="Start" />

    <bpmn:task
      id="Task_1"
      name="My Task" />

    <bpmn:endEvent
      id="EndEvent_1"
      name="End" />

    <bpmn:sequenceFlow
      id="Flow_1"
      sourceRef="StartEvent_1"
      targetRef="Task_1" />

    <bpmn:sequenceFlow
      id="Flow_2"
      sourceRef="Task_1"
      targetRef="EndEvent_1" />

  </bpmn:process>

  <bpmndi:BPMNDiagram
    id="BPMNDiagram_1">

    <bpmndi:BPMNPlane
      id="BPMNPlane_1"
      bpmnElement="Process_1">

      <bpmndi:BPMNShape
        id="StartEvent_1_di"
        bpmnElement="StartEvent_1">
        <dc:Bounds
          x="152"
          y="102"
          width="36"
          height="36" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape
        id="Task_1_di"
        bpmnElement="Task_1">
        <dc:Bounds
          x="240"
          y="80"
          width="100"
          height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape
        id="EndEvent_1_di"
        bpmnElement="EndEvent_1">
        <dc:Bounds
          x="392"
          y="102"
          width="36"
          height="36" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNEdge
        id="Flow_1_di"
        bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge
        id="Flow_2_di"
        bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>`;