import { CommonResponse } from "../common";

export interface Leave {
  _id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  userInfo: {
    _id: string;
    name: string;
    email: string;
  };
}

export type LeaveResponse = CommonResponse<Leave>;
