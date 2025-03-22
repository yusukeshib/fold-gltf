interface BrowseOption {
  accept: string;
}

export const browse = (opt: Partial<BrowseOption>): Promise<File> =>
  new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.multiple = false;
    if (opt.accept) input.accept = opt.accept;
    const elem = document.body.appendChild(input);

    // done
    elem.onchange = (evt: Event) => {
      const files = (evt.target as HTMLInputElement).files;
      if (files && files[0]) {
        cleanup();
        resolve(files[0]);
      }
    };

    const onCancel = () => {
      cleanup();
      reject();
    };

    // cancel
    const cleanup = () => {
      document.body.addEventListener("focus", onCancel);
      document.body.removeChild(elem);
    };

    //
    if (elem && document.createEvent) {
      const evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
    }
  });

export const readText = async (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (err) => {
      reject(err);
    };
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.readAsText(blob);
  });
};

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
