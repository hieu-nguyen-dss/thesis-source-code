import * as React from 'react'
import { Helmet } from 'react-helmet-async'

const DocumentTitleContext = React.createContext({})

const DocumentTitleProvider = ({ children }) => {
  const [title, setTitle] = React.useState('Test')

  return (
    <DocumentTitleContext.Provider value={ { title, setTitle } }>
      <Helmet>
        <title>
          { title }
        </title>
      </Helmet>
      {children}
    </DocumentTitleContext.Provider>
  )
}

const useDocumentTitle = () => React.useContext(DocumentTitleContext)

export {
  DocumentTitleProvider,
  useDocumentTitle
}
