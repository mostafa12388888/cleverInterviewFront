// composables/useFormBuilder.ts
import { reactive, ref, computed, onMounted } from 'vue'

export function useFormBuilder() {
  /* ---------- repository data ---------- */
  const groups = reactive([
    {
      title: 'Date and Time',
      open: true,
      items: [
        { id: 'date', title: 'Document Date', subtitle: 'Date picker', icon: '📅', type: 'date', entity: 'generic' },
        { id: 'datetime', title: 'Deadline', subtitle: 'Date & Time', icon: '⏰', type: 'datetime', entity: 'generic' },
      ],
    },
    {
      title: 'Text',
      open: true,
      items: [
        { id: 'subject', title: 'Subject', subtitle: 'Single line', icon: 'A', type: 'text', entity: 'generic' },
        { id: 'description', title: 'Description', subtitle: 'Long text', icon: 'T', type: 'textarea', entity: 'generic' },
        { id: 'email', title: 'Email', subtitle: 'Email field', icon: '✉️', type: 'email', entity: 'generic' },
      ],
    },
    {
      title: 'Selections',
      open: false,
      items: [
        { id: 'select1', title: 'Options', subtitle: 'Select input', icon: '▾', type: 'select', entity: 'generic' },
      ],
    },
  ])

  const search = ref('')
  const filteredGroups = computed(() => {
    if (!search.value) return groups
    const q = search.value.toLowerCase()
    return groups.map((g: any) => ({
      ...g,
      items: g.items.filter((i: any) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)),
    }))
  })

  /* ---------- board state ---------- */
  const elements = reactive<any[]>([])
  const selected = ref<any | null>(null)
  const board = ref<HTMLElement | null>(null)

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  function computePlaceholders(parsedType: any) {
    if (!parsedType) return { placeholder: '' }
    if (parsedType.entity === 'contact') {
      return { firstPlaceholder: 'Select Company', secondPlaceholder: 'Select Contact' }
    }
    const t = parsedType.type
    if (t === 'textarea') return { placeholder: 'Enter text here' }
    if (t === 'email') return { placeholder: 'Enter email here' }
    if (t === 'url') return { placeholder: 'Enter URL here' }
    if (t === 'number') return { placeholder: 'Enter number here' }
    if (t === 'date') return { placeholder: 'Select date' }
    if (t === 'datetime') return { placeholder: 'Select date and time' }
    if (t === 'select') return { placeholder: 'Please select' }
    return { placeholder: 'Enter text here' }
  }

  function buildBaseObject(parsedType: any) {
    return {
      id: parsedType?.id || genId(),
      titleEnglish: parsedType?.title || parsedType?.id || 'Field',
      titleArabic: parsedType?.titleArabic || '',
      type: parsedType?.type || 'text',
      show: true,
      parent: parsedType?.parent || 'generic',
    }
  }

  function buildLabelObject() {
    return {
      labelFontFamily: 'Noto Sans Arabic, sans-serif',
      labelFontSize: 14,
      labelFontWeight: 'normal',
      labelFontStyle: 'normal',
      labelDecoration: 'none',
      labelColor: '#000814',
    }
  }
  function buildInputObject() {
    return {
      inputFontFamily: 'Noto Sans Arabic, sans-serif',
      inputFontSize: 14,
      inputColor: '#000814',
      inputFontWeight: 'normal',
      inputStyle: 'normal',
      inputDecoration: 'none',
      inputTextAlign: 'left',
    }
  }
  function buildFieldObject() {
    return {
      fieldFillColor: '#ffffff',
      fieldBorderColor: '#B0B2B6',
      fieldBorderWidth: 1,
      fieldBorderStyle: 'solid',
    }
  }

  /* repo drag */
  function repoDragStart(e: DragEvent, item: any) {
    e.dataTransfer?.setData('application/json', JSON.stringify(item))
  }

  /* handle drop on board */
  function handleDropOnBoard(event: DragEvent) {
    event.preventDefault()
    const typeData = event.dataTransfer?.getData('application/json')
    if (!typeData) return
    let parsedType = null
    try { parsedType = JSON.parse(typeData) } catch { parsedType = { type: 'text', title: 'Field' } }
    if (!board.value) return
    const rect = board.value.getBoundingClientRect()
    const x = Math.max(0, Math.round(event.clientX - rect.left))
    const y = Math.max(0, Math.round(event.clientY - rect.top))

    const base = buildBaseObject(parsedType)
    const label = buildLabelObject()
    const input = buildInputObject()
    const field = buildFieldObject()
    const placeholders = computePlaceholders(parsedType)

    const newEl: any = {
      _id: genId(),
      type: parsedType.type || 'text',
      title: base.titleEnglish,
      titleArabic: base.titleArabic,
      placeholder: placeholders.placeholder || placeholders.firstPlaceholder || '',
      x, y,
      w: parsedType.type === 'textarea' ? 300 : 220,
      h: parsedType.type === 'textarea' ? 120 : 40,
      value: '',
      z: elements.length ? Math.max(...elements.map((e: any) => e.z || 1)) + 1 : 1,
      meta: { base, label, input, field, parsedType },
    }
    if (newEl.type === 'select') {
      newEl.options = [{ label: 'Option 1', value: 'opt1' }, { label: 'Option 2', value: 'opt2' }]
    }
    elements.push(newEl)
  }

  /* select / deselect / remove */
  function selectElement(el: any) {
    const top = elements.length ? Math.max(...elements.map((e: any) => e.z || 1)) + 1 : 1
    el.z = top
    selected.value = el
  }
  function deselect() { selected.value = null }
  function removeSelected() {
    if (!selected.value) return
    const idx = elements.findIndex(i => i._id === selected.value._id)
    if (idx !== -1) elements.splice(idx, 1)
    selected.value = null
  }

  /* render helpers */
  function renderInputType(el: any) {
    if (el.type === 'textarea') return 'textarea'
    if (el.type === 'select') return 'select'
    return 'input'
  }
  function selectProps(el: any) {
    const p: any = {}
    if (el.type === 'date') p.type = 'date'
    if (el.type === 'datetime') p.type = 'datetime-local'
    if (el.type === 'email') p.type = 'email'
    if (el.type === 'number') p.type = 'number'
    return p
  }
  function elementStyle(el: any) {
    return { left: el.x + 'px', top: el.y + 'px', width: el.w + 'px', height: el.h + 'px', zIndex: el.z || 1 }
  }

  /* dragging + resizing (simplified) */
  let dragState: any = null

  function startDragElement(e: MouseEvent, el: any) {
    if ((e as any).button !== 0) return
    selectElement(el)
    const startX = e.clientX, startY = e.clientY
    dragState = { type: 'move', el, startX, startY, origX: el.x, origY: el.y }
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', stopDrag)
  }
  function onDragMove(e: MouseEvent) {
    if (!dragState) return
    if (dragState.type === 'move') {
      const dx = Math.round(e.clientX - dragState.startX)
      const dy = Math.round(e.clientY - dragState.startY)
      dragState.el.x = Math.max(0, dragState.origX + dx)
      dragState.el.y = Math.max(0, dragState.origY + dy)
    } else if (dragState.type === 'resize') {
      handleResizeMove(e)
    }
  }
  function stopDrag() {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', stopDrag)
    dragState = null
  }

  function startResize(e: PointerEvent, el: any, corner: string) {
    (e.target as Element).setPointerCapture?.((e as any).pointerId)
    selectElement(el)
    dragState = {
      type: 'resize', el, corner,
      startX: (e as PointerEvent).clientX, startY: (e as PointerEvent).clientY,
      origW: el.w, origH: el.h, origX: el.x, origY: el.y,
    }
    window.addEventListener('pointermove', onPointerResize)
    window.addEventListener('pointerup', stopPointerResize)
  }
  function onPointerResize(e: PointerEvent) { handleResizeMove(e) }
  function handleResizeMove(e: any) {
    const s = dragState
    if (!s || s.type !== 'resize') return
    const dx = Math.round(e.clientX - s.startX)
    const dy = Math.round(e.clientY - s.startY)
    const minW = 60, minH = 30
    if (s.corner === 'se') { s.el.w = Math.max(minW, s.origW + dx); s.el.h = Math.max(minH, s.origH + dy) }
    else if (s.corner === 'ne') { s.el.w = Math.max(minW, s.origW + dx); s.el.h = Math.max(minH, s.origH - dy); s.el.y = Math.max(0, s.origY + dy) }
    else if (s.corner === 'sw') { s.el.w = Math.max(minW, s.origW - dx); s.el.h = Math.max(minH, s.origH + dy); s.el.x = Math.max(0, s.origX + dx) }
    if (board.value) {
      const rect = board.value.getBoundingClientRect()
      s.el.x = Math.min(s.el.x, rect.width - s.el.w)
      s.el.y = Math.min(s.el.y, rect.height - s.el.h)
    }
  }
  function stopPointerResize() {
    window.removeEventListener('pointermove', onPointerResize)
    window.removeEventListener('pointerup', stopPointerResize)
    dragState = null
  }

  /* options for select */
  function addOption() {
    if (!selected.value) return
    if (!selected.value.options) selected.value.options = []
    selected.value.options.push({ label: 'New', value: 'new' + Date.now().toString(36) })
  }
  function removeOption(i: number) {
    if (!selected.value) return
    selected.value.options.splice(i, 1)
  }

  function onTypeChange(el: any) {
    const parsedType = el.meta?.parsedType || { type: el.type }
    el.placeholder = computePlaceholders(parsedType).placeholder || ''
    if (el.type === 'textarea') el.h = Math.max(el.h, 100)
    if (el.type === 'select' && !el.options) el.options = [{ label: 'Option 1', value: 'opt1' }]
  }

  onMounted(() => {})

  return {
    groups, search, filteredGroups,
    elements, selected, board,
    repoDragStart, handleDropOnBoard, selectElement, deselect, removeSelected,
    renderInputType, selectProps, elementStyle,
    startDragElement, startResize, addOption, removeOption, onTypeChange
  }
}
