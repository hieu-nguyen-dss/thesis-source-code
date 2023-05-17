import * as React from 'react'
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  TableBody,
  TextField,
  Button
} from '@mui/material'
import {
  Close as CloseIcon,
  TopicSharp,
  Functions,
  Save,
  SubdirectoryArrowRight
} from '@mui/icons-material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import EditableCell from './EditableCell'
import EditableTreeInput from './EditableTreeInput'
import Statistics from './Statistics'
import Tree from './TableTree'
import { useSnackbar } from '../../contexts'
import { rubricApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'

const Templater = ({ initTree, yours }) => {
  const [tree, setTree] = React.useState(null)
  const [headers, setHeaders] = React.useState({
    root: initTree.tree[0].label
  })
  const [treeHeight, setTreeHeight] = React.useState(1)
  const [trigger, setTrigger] = React.useState(1)
  const [bfs, setBfs] = React.useState(null)
  const [leaves, setLeaves] = React.useState([])
  const [rows, setRows] = React.useState({})
  const [summary, setSummary] = React.useState({
    rowQuestions: {},
    rowPoints: {},
    attrQuestions: {},
    attrPoints: {},
    tableQuestions: 0,
    tablePoints: 0
  })
  const { openSnackbar } = useSnackbar()
  const { t } = useTranslation('common')

  const addNode = (parentId, label) => {
    const copyTree = tree
    copyTree.insert(parentId, nanoid(10), label)
    copyTree.resetTree()
    copyTree.resetLeaves()
    copyTree.calculateSize()
    onChangeLeaves(copyTree.leaves)
    setLeaves(copyTree.leaves)
    setTreeHeight(copyTree.root.height)
    setBfs(copyTree.BFS())
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const deleteNode = (id) => {
    const copyTree = tree
    copyTree.remove(id)
    copyTree.resetTree()
    copyTree.resetLeaves()
    copyTree.calculateSize()
    onChangeLeaves(copyTree.leaves)
    setLeaves(copyTree.leaves)
    setTreeHeight(copyTree.root.height)
    setBfs(copyTree.BFS())
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const markAsTopic = (id) => {
    const copyTree = tree
    copyTree.editIsTopic(id, true)
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const unMarkAsTopic = (id) => {
    const copyTree = tree
    copyTree.editIsTopic(id, false)
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const markAsSummary = (id) => {
    const copyTree = tree
    copyTree.editIsSummary(id, true)
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const unMarkAsSummary = (id) => {
    const copyTree = tree
    copyTree.editIsSummary(id, false)
    setTree(copyTree)
    setTrigger(trigger + 1)
  }

  const onChangeHeader = (id, value) => {
    const copyTree = tree
    copyTree.findAndEdit(id, value)
    setTree(copyTree)
    setHeaders({ ...headers, [id]: value })
  }

  const addTopic = () => {
    const row = leaves.reduce((res, cur) => {
      if (cur.isTopic) return { ...res, [cur.id]: { name: 'New Topic' } }
      if (cur.isSummary) return { ...res, [cur.id]: { nQuestions: 0, points: 0 } }
      return { ...res, [cur.id]: { content: '', nQuestions: 0, points: 0 } }
    }, {})
    setRows({ ...rows, [nanoid(10)]: row })
  }

  const onChangeLeaves = (changedLeaves) => {
    if (!Object.keys(rows).length) return
    let rs = {}
    for (const rowId in rows) {
      for (const leaf of changedLeaves) {
        rs = { ...rs, [rowId]: { ...(rs[rowId] || {}), [leaf.id]: rows[rowId][leaf.id] || {} } }
      }
    }
    setRows(rs)
  }
  const deleteTopic = (topicId) => {
    const copyRows = { ...rows }
    delete copyRows[topicId]
    setRows(copyRows)
  }

  const onChangeRow = (rowId, attrId, value) => {
    setRows({ ...rows, [rowId]: { ...(rows[rowId] || {}), [attrId]: value } })
  }

  const calcSummary = () => {
    const rowQuestions = {}
    const rowPoints = {}
    const attrQuestions = {}
    const attrPoints = {}
    let tableQuestions = 0
    let tablePoints = 0
    for (const rowId in rows) {
      for (const leaf of leaves) {
        if (!leaf.isTopic && !leaf.isSummary) {
          const cellQuestions = parseInt(rows[rowId][leaf.id].nQuestions) || 0
          const cellPoints = parseFloat(rows[rowId][leaf.id].points) || 0
          rowQuestions[rowId] = (rowQuestions[rowId] || 0) + cellQuestions
          rowPoints[rowId] = (rowPoints[rowId] || 0) + cellPoints
          attrQuestions[leaf.id] = (attrQuestions[leaf.id] || 0) + cellQuestions
          attrPoints[leaf.id] = (attrPoints[leaf.id] || 0) + cellPoints
          tablePoints += cellPoints
          tableQuestions += cellQuestions
        }
      }
    }
    const rs = {
      rowQuestions,
      rowPoints,
      attrQuestions,
      attrPoints,
      tableQuestions,
      tablePoints
    }
    setSummary(rs)
  }

  const loadTree = () => {
    const copyInit = [...initTree.tree]
    const root = copyInit.shift()
    const newTree = new Tree(root.id, root.label)
    let headers = { root: root.label }
    for (const node of copyInit) {
      newTree.insert(node.parent, node.id, node.label, node.isTopic, node.isSummary)
      headers = { ...headers, [node.id]: node.label }
    }
    setHeaders(headers)
    newTree.calculateSize()
    onChangeLeaves(newTree.leaves)
    setLeaves(newTree.leaves)
    setTreeHeight(newTree.root.height)
    setBfs(newTree.BFS())
    setTree(newTree)
    if (initTree.rows) setRows(initTree.rows)
  }

  const submitChangeRubric = async () => {
    try {
      const { status, data } = await rubricApi.updateRubric(initTree._id, {
        tree: tree.treeToJson(),
        rows
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Save successfully')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Save error')
    }
  }
  React.useEffect(() => {
    loadTree()
  }, [initTree])
  React.useEffect(() => {
    if (tree) {
      calcSummary()
    }
  }, [rows])

  return (
    <Box sx={{ flexGrow: 1, mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          {tree &&
            trigger &&
            [...tree.preOrderTraversal()].map(({ id, level, isLeaf, isTopic, isSummary }) => {
              return (
                <Box
                  key={id}
                  sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                  <Box
                    sx={{
                      // width: 60 * level,
                      pl: `${(level - 1) * 60}px`,
                      height: 6,
                      display: 'flex',
                      flexDirection: 'row'
                    }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 3,
                        background: '#ababaa',
                        mr: 1
                      }}></Box>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                    <EditableTreeInput
                      autoFocus
                      update={(value) => onChangeHeader(id, value)}
                      initialValue={headers[id] || ''}
                    />
                    {yours && (
                      <Box
                      sx={{
                        flexGrow: 1,
                        border: 'none',
                        borderTop: '2px dotted #ababaa',
                        mr: 2
                      }}></Box>
                    )}
                    {yours && (
                      <Box>
                        <Tooltip title={t('rubrics.addSubColumn')}>
                          <IconButton
                            onClick={() => addNode(id, '')}
                            sx={{ width: 24, height: 24 }}>
                            <SubdirectoryArrowRight
                              color="primary"
                              sx={{ width: 20, height: 20 }}
                            />
                          </IconButton>
                        </Tooltip>
                        {id !== 'root' && (
                          <Tooltip title={t('rubrics.deleteColumn')}>
                            <IconButton
                              onClick={() => deleteNode(id)}
                              sx={{ width: 24, height: 24 }}>
                              <CloseIcon sx={{ width: 20, height: 20 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {isLeaf && (
                          <React.Fragment>
                            {isTopic && (
                              <Tooltip title={t('rubrics.unmarkTopic')}>
                                <IconButton
                                  onClick={() => unMarkAsTopic(id)}
                                  sx={{ width: 24, height: 24 }}>
                                  <TopicSharp sx={{ width: 20, height: 20 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {!isTopic && (
                              <Tooltip title={t('rubrics.markTopic')}>
                                <IconButton
                                  onClick={() => markAsTopic(id)}
                                  sx={{ width: 24, height: 24 }}>
                                  <TopicSharp color="primary" sx={{ width: 20, height: 20 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {isSummary && (
                              <Tooltip
                                onClick={() => unMarkAsSummary(id)}
                                title={t('rubrics.unmarkSummary')}>
                                <IconButton sx={{ width: 24, height: 24 }}>
                                  <Functions sx={{ width: 20, height: 20 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {!isSummary && (
                              <Tooltip
                                onClick={() => markAsSummary(id)}
                                title={t('rubrics.markSummary')}>
                                <IconButton sx={{ width: 24, height: 24 }}>
                                  <Functions color="primary" sx={{ width: 20, height: 20 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )
            })}
          {/* <Statistics /> */}
        </Box>
        <Statistics leaves={leaves} rows={rows} summary={summary} />
      </Box>
      {yours && (
        <>
          <Button
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              borderRadius: 1,
              '&:hover': {
                background: 'white'
              }
            }}
            startIcon={<Save />}
            onClick={submitChangeRubric}>
            {t('rubrics.save')}
          </Button>
          <Button
            size="small"
            startIcon={<TopicSharp />}
            onClick={addTopic}
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              borderRadius: 1,
              '&:hover': {
                background: 'white'
              },
              ml: 1
            }}>
            {t('rubrics.newTopic')}
          </Button>
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', mt: 1, mb: 3 }}>
        <Table>
          <TableHead sx={{ borderBottom: '2px solid rgb(167, 167, 167)' }}>
            {bfs &&
              Object.keys(bfs).map((level) => (
                <TableRow key={'bfs' + level}>
                  {bfs[level].map(({ id, label, width, isLeaf, isTopic, isSummary }) => (
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        position: 'relative',
                        color: isTopic ? '#1976d2' : 'inherit',
                        border: '1px solid rgb(167, 167, 167)'
                      }}
                      key={id}
                      colSpan={width}
                      rowSpan={isLeaf ? treeHeight - level : 1}>
                      {label}
                      {isTopic && (
                        <TopicSharp
                          sx={{ position: 'absolute', left: 0, top: 0 }}
                          color="primary"
                        />
                      )}
                      {isSummary && (
                        <Functions
                          sx={{ position: 'absolute', right: 0, top: 0 }}
                          color="success"
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableHead>
          <TableBody>
            {Object.entries(rows).map(([rowId, rowValue], index) => (
              <React.Fragment key={index}>
                <TableRow>
                  {leaves.map((leaf, index) => {
                    if (leaf.isTopic) {
                      return (
                        <TableCell key={leaf.id + index} rowSpan={2} sx={{ position: 'relative' }}>
                          <EditableCell
                            topic={true}
                            updateTable={(name) => onChangeRow(rowId, leaf.id, { name })}
                            initialValue={rowValue[leaf.id].name || ''}
                          />
                          {yours && (
                            <IconButton
                              onClick={() => deleteTopic(rowId)}
                              size="small"
                              sx={{ position: 'absolute', top: 0, left: 0 }}>
                              <CloseIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )
                    }
                    if (leaf.isSummary) {
                      return (
                        <TableCell key={leaf.id + index} rowSpan={2}>
                          <TextField
                            type="number"
                            value={summary.rowQuestions[rowId] || 0}
                            label={t('rubrics.questions')}
                            size="small"
                            InputProps={{ sx: { width: 90 } }}
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <TextField
                            type="number"
                            value={summary.rowPoints[rowId] || 0}
                            label={t('rubrics.points')}
                            size="small"
                            InputProps={{ sx: { width: 90 } }}
                          />
                          <Box>
                            {`${t('rubrics.questions')}: ${(summary.tablePoints === 0
                              ? 0
                              : (summary.rowQuestions[rowId] / summary.tableQuestions) * 100
                            ).toFixed(2)} %`}
                            {`${t('rubrics.points')}: ${(summary.tablePoints === 0
                              ? 0
                              : (summary.rowPoints[rowId] / summary.tablePoints) * 100
                            ).toFixed(2)} %`}
                          </Box>
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={leaf.id + index}>
                        <EditableCell
                          initialValue={rowValue[leaf.id].content || ''}
                          updateTable={(content) =>
                            onChangeRow(rowId, leaf.id, {
                              content,
                              nQuestions: rowValue[leaf.id].nQuestions,
                              points: rowValue[leaf.id].points
                            })
                          }
                        />
                      </TableCell>
                    )
                  })}
                </TableRow>
                <TableRow sx={{ borderBottom: '2px solid rgb(167, 167, 167)' }}>
                  {leaves
                    .filter((leaf) => !leaf.isTopic && !leaf.isSummary)
                    .map((leaf, index) => (
                      <TableCell key={index}>
                        <TextField
                          type="number"
                          value={rowValue[leaf.id].nQuestions || 0}
                          label={t('rubrics.questions')}
                          size="small"
                          sx={{ mb: 1, mr: 1 }}
                          InputProps={{ sx: { width: 90 } }}
                          onChange={(e) =>
                            onChangeRow(rowId, leaf.id, {
                              nQuestions: e.target.value,
                              points: rowValue[leaf.id].points || 0,
                              content: rowValue[leaf.id].content
                            })
                          }
                        />
                        <TextField
                          type="number"
                          value={rowValue[leaf.id].points || 0}
                          label={t('rubrics.points')}
                          size="small"
                          InputProps={{ sx: { width: 90 } }}
                          onChange={(e) =>
                            onChangeRow(rowId, leaf.id, {
                              nQuestions: rowValue[leaf.id].nQuestions || 0,
                              points: e.target.value,
                              content: rowValue[leaf.id].content
                            })
                          }
                        />
                      </TableCell>
                    ))}
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow sx={{ border: '2px solid #ddd', background: '#efefef' }}>
              {leaves.map((leaf) => {
                if (leaf.isTopic) {
                  return <TableCell key={leaf.id}>Summary</TableCell>
                }
                if (leaf.isSummary) {
                  return (
                    <TableCell key={leaf.id}>
                      <TextField
                        type="number"
                        value={summary.tableQuestions}
                        label={t('rubrics.questions')}
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                        InputProps={{ sx: { width: 90 } }}
                      />
                      <TextField
                        type="number"
                        value={summary.tablePoints}
                        label={t('rubrics.points')}
                        size="small"
                        InputProps={{ sx: { width: 90 } }}
                      />
                    </TableCell>
                  )
                }
                return (
                  <TableCell key={leaf.id}>
                    <TextField
                      type="number"
                      value={summary.attrQuestions[leaf.id] || 0}
                      label={t('rubrics.questions')}
                      size="small"
                      sx={{ mb: 1, mr: 1 }}
                      InputProps={{ sx: { width: 90 } }}
                    />
                    <TextField
                      type="number"
                      value={summary.attrPoints[leaf.id] || 0}
                      label={t('rubrics.points')}
                      size="small"
                      InputProps={{ sx: { width: 90 } }}
                    />
                    <Box>
                      {`${t('rubrics.questions')}: ${(summary.tablePoints === 0
                        ? 0
                        : (summary.attrQuestions[leaf.id] / summary.tableQuestions) * 100
                      ).toFixed(2)} %`}
                      {`${t('rubrics.points')}: ${(summary.tablePoints === 0
                        ? 0
                        : (summary.attrPoints[leaf.id] / summary.tablePoints) * 100
                      ).toFixed(2)} %`}
                    </Box>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ width: 30 }}></Box>
      </Box>
    </Box>
  )
}
export default React.memo(Templater)
