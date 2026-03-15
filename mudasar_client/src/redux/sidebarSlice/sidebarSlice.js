import {createSlice} from "@reduxjs/toolkit"
import { TenantSidebar } from "./SidebarConstant"


export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState:TenantSidebar,
    reducers: {
      toggleFunc: (state, action) => {
        state.map((content, i) =>
          i === action.payload
            ? state[i].toggle = !state[i].toggle // Corrected line
            : content
        );
      },
    },
  });

export const {toggleFunc} = sidebarSlice.actions
export default sidebarSlice.reducer