import * as React from 'react'

const DesignerContext = React.createContext({})

const DesignerProvider = ({ lessonParts, updateHistories, children, resources: resc, editable }) => {
  const [columns, setColumns] = React.useState({})
  const [columnOrder, setColumnOrder] = React.useState([])
  const [tasks, setTasks] = React.useState({})
  const [histories, setHistories] = React.useState([])
  const [resources, setResources] = React.useState([])

  const pushHistory = (newHistory) => {
    setHistories([newHistory, ...histories])
  }

  React.useEffect(() => {
    let co = []
    let c = {}
    let t = {}
    for (const lessonPart of lessonParts) {
      co = [...co, lessonPart._id]
      const actions = lessonPart.learningActions.reduce(
        (res, cur) => ({ ...res, [cur._id]: { ...cur, id: cur._id } }),
        {}
      )
      c = {
        ...c,
        [lessonPart._id]: {
          id: lessonPart._id,
          name: lessonPart.name,
          taskIds: lessonPart.learningActions.map((la) => la._id)
        }
      }
      t = { ...t, ...actions }
    }
    setTasks(t)
    setColumns(c)
    setColumnOrder(co)
    setHistories(updateHistories.reverse())
  }, [])
  React.useEffect(() => {
    setResources(resc)
  }, [resc])
  return (
    <DesignerContext.Provider
      value={{
        columns,
        setColumns,
        columnOrder,
        setColumnOrder,
        tasks,
        setTasks,
        histories,
        pushHistory,
        resources,
        setResources,
        editable
      }}>
      {children}
    </DesignerContext.Provider>
  )
}

const useDesigner = () => React.useContext(DesignerContext)

export { DesignerProvider, useDesigner }
