let audioContext = null

export function playPageRustle() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  if (!audioContext) audioContext = new AudioCtx()
  const ctx = audioContext
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})

  const duration = 0.11
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    const envelope = Math.pow(1 - i / length, 2.4)
    data[i] = (Math.random() * 2 - 1) * envelope * 0.13
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1450
  filter.Q.value = 0.7
  source.connect(filter)
  filter.connect(ctx.destination)
  source.start()
}
