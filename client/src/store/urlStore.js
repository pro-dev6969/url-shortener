import { makeAutoObservable } from "mobx"
import {
  createUrl,
  deleteUrlByUrlCode,
  getUrlsForUser
} from "../Services/urlServices"
import snackBarStore from "../components/common/Snackbar/store/snackBarStore"

class UrlStore {
  urlData = []
  urlDataLoading = false
  showUrlAddView = false
  newUrlPayload = {
    originalLink: "",
    name: ""
  }

  constructor() {
    makeAutoObservable(this)
  }

  init = () => {
    this.fetchUrlsForUser()
  }

  //Fetch urls for users
  fetchUrlsForUser = async () => {
    try {
      this.urlDataLoading = true

      const data = await getUrlsForUser()
      this.setUrlData(data)
      this.urlDataLoading = false
    } catch (error) {
      console.log(error)
    }
  }

  //create new url
  createNewUrl = async () => {
    try {
      if (!this.newUrlPayload.originalLink) {
        alert("Original link is required")
        return
      }
      await createUrl(this.newUrlPayload)
      this.fetchUrlsForUser()
      this.showUrlAddView = false
    } catch (error) {}
  }

  //delete url
  deleteUrl = async urlCode => {
    await deleteUrlByUrlCode(urlCode)
    this.fetchUrlsForUser()
    snackBarStore.showSnackBar("Deleted Successfully", "success")
  }

  setUrlData = data => (this.urlData = data)

  setShowUrlAddView = val => (this.showUrlAddView = val)
}

const urlStore = new UrlStore()
export default urlStore
