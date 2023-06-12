export type HtmlNodeConfig = {
  type: string,
  label: string,
  style: {
    width: string,
    height: string,
    borderRadius?: string,
    border: string,
    transform?: string,
  }
}

export type groovyNodeProperty = {
  script: string
}

export type javaInvokerNodeProperty = {
  bean: string,
  method: string,
  params: string,
  _contextName: string
}