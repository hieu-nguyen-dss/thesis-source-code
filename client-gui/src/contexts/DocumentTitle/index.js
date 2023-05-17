import * as React from 'react'
import { Helmet } from 'react-helmet-async'

const DocumentTitleContext = React.createContext({})

const DocumentTitleProvider = ({ children }) => {
  const [title, setTitle] = React.useState('Home')
  React.useEffect(() => {
    document.title = title
  }, [title])
  return (
    <DocumentTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </DocumentTitleContext.Provider>
  )
}

const useDocumentTitle = () => React.useContext(DocumentTitleContext)

export { DocumentTitleProvider, useDocumentTitle }
