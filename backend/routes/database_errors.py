import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlmodel import Session

logger = logging.getLogger("uvicorn.error")


def commit_or_raise(session: Session, conflict_detail: str) -> None:
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        logger.warning("Conflito de integridade ao persistir dados", exc_info=error)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=conflict_detail,
        ) from error
    except SQLAlchemyError as error:
        session.rollback()
        logger.exception("Falha inesperada ao persistir dados", exc_info=error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível concluir a operação.",
        ) from error
