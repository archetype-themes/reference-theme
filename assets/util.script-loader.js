export default async function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) {
    console.warn(`Script with src "${src}" is already loaded.`)
    return
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = src
  script.async = true

  const loaded = new Promise((resolve, reject) => {
    script.onerror = (error) => reject(new Error(`Failed to load script: ${src}: ${error}`))

    script.onload = () => resolve()
  })

  document.head.appendChild(script)
  await loaded
}
